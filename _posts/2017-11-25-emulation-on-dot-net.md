---
layout: post
title:  "Emulation on .NET"
date:   2017-11-25 14:21:00 +0000
author: Alex Haslehurst
categories: software development emulation
---

Please check out my GameBoy emulator written in .NET Core; [Retro.Net](https://github.com/axle-h/Retro.Net). Yes, a GameBoy emulator written in .NET Core. *Why? Why not*.
I plan to do a few write-ups about my experience with this project. Firstly: why it was a bad idea.

<!--break-->

Retro.Net started as a programming exercise for me many years ago. I wanted a goal to work towards and wasn’t happy with the boring examples that accompanied tutorials. Instead, I started a project that I knew would encourage me to continue writing code in my spare time whilst also including a few personal interests of electronics and retro gaming. It has been re-written multiple times over the years and evolved into a successful product that actually plays Tetris at full speed. The CPU core is dynamically compiled into .NET with the help of the expression tree API and cached for speed. User interface is currently handled by ASP.NET Core, communicating over web sockets to a client written in Angular that’s geared towards a crowd gaming style of input. 

Let’s cut to it.
> .NET is *not* an ideal platform for emulating legacy hardware.

##### .NET vs low level languages

Languages conforming to the common language infrastructure (CLI) that run on the .NET platform such as C# are high level, meaning that they do not compile directly to machine code. Instead they are initially compiled into intermediate language (IL), a sort of object orientated, stack based assembly language written for a hypothetical .NET virtual machine. Software compiled to IL is run with the common language runtime (CLR), which uses just in time (JIT) compilation to convert the IL into the native machine code on which the CLR is running. For server, enterprise and productivity software this has a load of advantages over software written with low level languages such as C.

* Compiling to IL is significantly faster than compiling to machine code as the .NET compiler does not have to worry about header files, linking, (heavy) optimizations and has some tools such as generics that low level languages lack but have slower to compile alternatives such as templates.
* There are obvious exceptions such as P/Invoke and COM Interop but generally software compiled to IL bytecode can be executed on any platform that has a CLR written for it. In low level languages such as C, software must be carefully written to be portable and be concerned with low level concepts such as integer sizes, floating point number formats, file system differences and endianness. Also a lot of C code is written for the GNU C library so will only run on POSIX compliant operating systems such as Linux and would require significant work to port to other platforms such as Microsoft C++.
* C# and other CLI languages are easier to learn and have more richer features that speed up development time such as reflection, LINQ, generics, task asynchronous programming (TAP), better exception handling and functional programming.
* Memory management in CLR languages is automatic. Garbage collection will take care of dereferenced data and the convenient disposable pattern, which has syntactic sugar available in the form of “using” blocks, encourages developers to take care of data that cannot be automatically cleaned up. Memory management in low level languages is a manual process where stack pointers must be cleared up to avoid leaking memory.
* Since code written for CLI languages is run within the context of the CLR, it can be easily sandboxed to provide security for the rest of the system. This means that if the .NET application were to be compromised, operating systems can restrict the attack to the permissions granted to the CLR itself. Low level software is more susceptible to attacks caused by sloppy development such as use after free and buffer overflow.

For all of these trade-offs, low level languages get some features that directly benefit emulating legacy systems:

* Due to the extra step of JIT compilation and consequently the lack of time to properly optimize the emitted machine code, CLI languages have poorer runtime performance over low level languages.
* The high precision timing required to emulate legacy platforms is difficult, expensive or even impossible on the CLR. For example the GameBoy screen runs at 60Hz but we must increment a register at 3 distinct phases of drawing each of the 144 lines of the LCD. This works out as about 1/20th of a millisecond. Some GameBoy software relies on watching this register for timing so we must be accurate with it. The minimum resolution of Task.Delay is variable and can be in the order of 10’s of milliseconds, so we must resort to inefficient thread blocking techniques such as spin waiting. Low level languages have direct access to system peripherals such as high precision timers and even direct access to machine code in order to utilize timing features of the host platform’s CPU.
* Timing again… The CLR will periodically pause the entire application to perform garbage collection and these pauses can be in the order of 10’s or even 100’s of milliseconds. This is fine for traditional desktop or web applications as very few people will be able to tell that their application froze for 10 milliseconds or their last page load took 10 milliseconds longer than usual. However, it’s not ok for emulators as a long pause can span multiple rendering frames, resulting in a stuttered feel to the presentation.

##### What this means for emulation on .NET

For these reasons software emulating legacy platforms has traditionally been written in low level languages. This doesn’t mean that it’s impossible - just difficult to be accurate whilst also maintaining an acceptable level of efficiency.

Playing games on an emulator is a use case where a high level of timing accuracy is essential as the presentation should match the original hardware as much as possible. However, there are use cases for emulators other than playing games where cycle accurate timing is not essential and in fact running the simulation as fast as possible would be beneficial.

A great example of this would be in training a machine learning algorithm to play software written for the emulated platform. In this case we would prefer to run multiple instances of the emulated platform, training multiple agents concurrently and would also prefer the training to be faster than real-time.

Another example would be in the user interface of Retro.Net. This employs a crowd gaming concept, where all connected clients can vote on the next input. Cycle accurate timing is not essential as HTTP latency and the voting period length can be many orders of magnitude longer than the timing resolution required.

Next time I’ll have a look at the core of the emulator that runs the GameBoy Z80 derived CPU with a high level form of dynamic recompilation.
