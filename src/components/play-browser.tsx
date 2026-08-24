import { useRef, useState } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

/**
 * Lazily loads and runs an emscripten (non-modularized, global `Module`) game in a canvas.
 *
 * Nothing is downloaded until the user presses play; the wasm is then fetched with a
 * progress bar (measured against `size`, the known uncompressed byte count, so compressed
 * transfer encodings don't skew it) and handed to the loader via `Module.wasmBinary`.
 * Config and high scores persist to IndexedDB via an IDBFS mount at /data, matching the
 * game's own web shell.
 *
 * The loader declares `class`/`let` globals (e.g. `ExitStatus`) so it cannot be executed
 * twice as a classic script: instead its text is fetched once and each run executes it in
 * a fresh function scope via `new Function`, with a postamble that hands the run's `FS` /
 * `IDBFS` / run-dependency helpers out through `Module.__internals` (they are locals of
 * that scope, not window globals).
 *
 * When the game quits it calls `emscripten_force_exit`, which fires `Module.onExit` with
 * the exit status: the dead run's WebAudio nodes are closed (emscripten never tears them
 * down and a zombie `onaudioprocess` otherwise fires forever) and the play overlay comes
 * back with a fresh canvas (the old one keeps its WebGL context) and the cached wasm
 * binary, so playing again is instant. Append `#autoplay` to the URL to skip the play
 * button (used for smoke testing).
 */
export function PlayBrowser({
  js,
  wasm,
  size,
  note,
}: {
  /** absolute URL of the emscripten .js loader */
  js: string
  /** absolute URL of the .wasm it references */
  wasm: string
  /** uncompressed size of the wasm in bytes, for accurate progress */
  size: number
  /** short line shown under the play button, e.g. the download size */
  note?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const binaryRef = useRef<ArrayBuffer | null>(null)
  const jsTextRef = useRef<string | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'running' | 'error'>(
    'idle',
  )
  const [runKey, setRunKey] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [status, setStatus] = useState('')

  const stopAudio = (module: any) => {
    // emscripten never tears down SDL's WebAudio nodes, so the dead run's
    // onaudioprocess keeps firing forever: close its audio outright
    const sdl2 = module?.SDL2
    try {
      sdl2?.audio?.scriptProcessorNode?.disconnect()
    } catch {
      /* already gone */
    }
    try {
      sdl2?.capture?.scriptProcessorNode?.disconnect()
    } catch {
      /* already gone */
    }
    try {
      void sdl2?.audioContext?.close()?.catch?.(() => {})
    } catch {
      /* already closed */
    }
  }

  const download = async () => {
    const response = await fetch(wasm)
    if (!response.ok || !response.body) {
      throw new Error(`${response.status} fetching the game`)
    }
    const reader = response.body.getReader()
    const parts: Uint8Array[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      parts.push(value)
      received += value.length
      setLoaded(received)
    }
    const wasmBinary = new Uint8Array(received)
    let offset = 0
    for (const part of parts) {
      wasmBinary.set(part, offset)
      offset += part.length
    }
    return wasmBinary.buffer
  }

  const start = async () => {
    if (state === 'loading' || state === 'running') {
      return
    }
    try {
      if (!binaryRef.current || !jsTextRef.current) {
        setState('loading')
        const [binary, jsText] = await Promise.all([
          download(),
          fetch(js).then((response) => {
            if (!response.ok) {
              throw new Error(`${response.status} fetching the loader`)
            }
            return response.text()
          }),
        ])
        binaryRef.current = binary
        jsTextRef.current = jsText
      }

      // the game sets document.title to its own name (the loader assigns it
      // directly, there is no Module hook to prevent it): pin the page's title
      // while it runs, reverting any change before it paints
      const savedTitle = document.title
      const titleElement = document.querySelector('title')
      const titleObserver = titleElement
        ? new MutationObserver(() => {
            if (document.title !== savedTitle) {
              document.title = savedTitle
            }
          })
        : undefined
      if (titleElement && titleObserver) {
        titleObserver.observe(titleElement, {
          childList: true,
          characterData: true,
          subtree: true,
        })
      }

      let exited = false
      const module: any = {
        canvas: canvasRef.current,
        wasmBinary: binaryRef.current,
        locateFile: (path: string) => (path.endsWith('.wasm') ? wasm : path),
        preRun: [
          () => {
            // config + high scores live in /data, persisted to IndexedDB
            const { FS, IDBFS, addRunDependency, removeRunDependency } =
              module.__internals
            FS.mkdir('/data')
            FS.mount(IDBFS, { autoPersist: true }, '/data')
            addRunDependency('idbfs')
            FS.syncfs(true, (err: unknown) => {
              if (err) {
                console.error('idbfs load', err)
              }
              removeRunDependency('idbfs')
            })
          },
        ],
        setStatus: (text: string) => setStatus(text),
        onExit: (code: number) => {
          // the game quit (menu quit / Escape): silence this run and offer a restart
          // on a fresh canvas (the old one keeps its WebGL context). onExit can fire
          // more than once while the exit unwinds, hence the guard.
          if (exited) {
            return
          }
          exited = true
          stopAudio(module)
          titleObserver?.disconnect()
          document.title = savedTitle
          setStatus('')
          setRunKey((key) => key + 1)
          setState(code === 0 ? 'idle' : 'error')
        },
        onAbort: () => {
          titleObserver?.disconnect()
          document.title = savedTitle
          setState('error')
        },
      }
      // the global stays pointed at the latest run; straggling callbacks from a dead
      // run still read it, which is harmless once its audio is stopped
      ;(window as any).Module = module

      // execute the loader in a fresh function scope: its class/let declarations
      // (e.g. `class ExitStatus`) make a second classic <script> execution a
      // SyntaxError, and a function scope isolates each run's globals anyway.
      // Module goes in as a parameter: the loader's own hoisted `var Module`
      // merges with a parameter of the same name, whereas a plain function
      // scope would shadow the global with undefined.
      const postamble =
        '\n;Module.__internals = { FS, IDBFS, addRunDependency, removeRunDependency };'
      new Function('Module', jsTextRef.current + postamble)(module)

      setState('running')
      canvasRef.current?.focus()
    } catch (error) {
      console.error('failed to start the game', error)
      setState('error')
    }
  }

  const percent = Math.min(100, Math.round((loaded / size) * 100))
  const mb = (bytes: number) => (bytes / 1_000_000).toFixed(1)

  return (
    <Box
      position="relative"
      w="100%"
      maxW={1280}
      mx="auto"
      my={4}
      bg="black"
      borderRadius="md"
      overflow="hidden"
      ref={(el: HTMLDivElement | null) => {
        // smoke-test hook: #autoplay starts the game without a click
        if (
          el &&
          state === 'idle' &&
          runKey === 0 &&
          window.location.hash === '#autoplay'
        ) {
          void start()
        }
      }}
    >
      <canvas
        key={runKey}
        ref={canvasRef}
        id="canvas"
        width={1280}
        height={720}
        tabIndex={0}
        onContextMenu={(e) => e.preventDefault()}
        style={{ display: 'block', width: '100%', aspectRatio: '16 / 9' }}
      />
      {state !== 'running' && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={3}
          bg="blackAlpha.800"
        >
          {state === 'error' ? (
            <Text color="red.300">
              That didn't work, sorry. Reload the page to try again.
            </Text>
          ) : state === 'loading' ? (
            <>
              <Box w="60%" maxW={400} h={2} bg="whiteAlpha.300" borderRadius="full">
                <Box
                  w={`${percent}%`}
                  h="100%"
                  bg="blue.400"
                  borderRadius="full"
                  transition="width .2s"
                />
              </Box>
              <Text color="whiteAlpha.800" fontSize="sm">
                {mb(loaded)} / {mb(size)} MB
              </Text>
            </>
          ) : (
            <>
              <Button size="lg" colorPalette="blue" onClick={() => void start()}>
                ▶ {binaryRef.current ? 'Play again' : 'Play'}
              </Button>
              {note && !binaryRef.current && (
                <Text color="whiteAlpha.700" fontSize="sm">
                  {note}
                </Text>
              )}
            </>
          )}
        </Box>
      )}
      {state === 'running' && status && (
        <Text
          position="absolute"
          left={0}
          right={0}
          bottom={1}
          textAlign="center"
          fontSize="sm"
          color="whiteAlpha.700"
          pointerEvents="none"
        >
          {status}
        </Text>
      )}
    </Box>
  )
}
