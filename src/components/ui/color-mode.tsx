import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * Blocking inline script, rendered into <head> ahead of everything else.
 *
 * It applies the persisted (or system) colour mode to <html> before first paint, so the page never
 * flashes the wrong theme. Nothing in React can do this — by the time components run, the browser
 * has already painted.
 *
 * The class it sets is the source of truth that the store below reads back.
 */
export const COLOR_MODE_SCRIPT = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
var m=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
var r=document.documentElement;
r.classList.remove('light','dark');r.classList.add(m);r.style.colorScheme=m;
}catch(e){}})()`

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

/* -------------------------------------------------------------------------------------------- */
/* Store — <html>'s class is the state; React just subscribes to it.                              */
/* -------------------------------------------------------------------------------------------- */

const listeners = new Set<() => void>()

function currentMode(): ColorMode {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)

  // Follow the OS while the visitor hasn't made an explicit choice.
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystemChange = () => {
    if (readStoredMode()) return
    applyColorMode(query.matches ? 'dark' : 'light')
  }
  query.addEventListener('change', onSystemChange)

  return () => {
    listeners.delete(onStoreChange)
    query.removeEventListener('change', onSystemChange)
  }
}

/**
 * Undefined during SSR *and* during the first client render, so hydration matches the prerendered
 * HTML exactly. React swaps to the live snapshot immediately afterwards.
 */
function getServerSnapshot(): ColorMode | undefined {
  return undefined
}

function readStoredMode(): ColorMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

/** Applies the mode to <html>, suppressing transitions so the switch doesn't animate. */
function applyColorMode(mode: ColorMode) {
  const root = document.documentElement
  const style = document.createElement('style')
  style.appendChild(
    document.createTextNode(
      '*,*::before,*::after{transition:none!important;animation:none!important}'
    )
  )
  document.head.appendChild(style)

  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.style.colorScheme = mode

  // Force a reflow so the no-transition rule covers the change above, then drop it.
  void window.getComputedStyle(style).opacity
  document.head.removeChild(style)

  listeners.forEach((listener) => listener())
}

/* -------------------------------------------------------------------------------------------- */

const ColorModeContext = createContext<UseColorModeReturn>({
  colorMode: undefined as unknown as ColorMode,
  setColorMode: () => {},
  toggleColorMode: () => {},
})

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const colorMode = useSyncExternalStore(
    subscribe,
    currentMode,
    getServerSnapshot
  )

  const setColorMode = useCallback((mode: ColorMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // private mode / storage disabled — the theme still applies for this page view
    }
    applyColorMode(mode)
  }, [])

  const value = useMemo<UseColorModeReturn>(
    () => ({
      colorMode: colorMode as ColorMode,
      setColorMode,
      toggleColorMode: () =>
        setColorMode(currentMode() === 'dark' ? 'light' : 'dark'),
    }),
    [colorMode, setColorMode]
  )

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode(): UseColorModeReturn {
  return useContext(ColorModeContext)
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}
