---
layout: post
title:  "Emulating the GameBoy CPU on .NET"
date:   2017-12-03 16:20:00 +0000
author: Alex Haslehurst
categories: software development emulation
---

At it’s lowest level, a CPU can be represented by a finite state machine, where state is handled by registers and domain by the address space. This model is pretty simple to implement in software as all you need is a mechanism for tracking state and a definition of all possible state transitions. Luckily the GameBoy CPU, a Sharp LR35902, is derived from the popular and very well documented Zilog Z80 - A microprocessor that is unbelievably still in production today, over 40 years after it’s introduction.

<!--break-->

#### Architecture

The Z80 is an 8-bit microprocessor, meaning that each operation is natively performed on a single byte. The instruction set does have some 16-bit operations but these are just executed as multiple cycles of 8-bit logic. The GameBoy CPU has a 16-bit wide address bus, which logically represents a 64K memory map. Data is transferred to the CPU over an 8-bit wide data bus but this is irrelevant to simulating the system at state machine level. The Z80 and the Intel 8080 that it derives from have 256 I/O ports for accessing external peripherals but the GameBoy CPU has none - favouring memory mapped I/O instead. Since I found an abundance of Z80 documentation, including non-official, or undocumented behaviours that were discovered by ZX Spectrum developers, I opted to implement an emulator compatible with the full Z80 specification. To achieve Intel 8080 and GameBoy compatibility, which aren’t strict logical subsets of the Z80, I simply provide a platform configuration mechanism that can toggle features.

#### Registers

Firstly we need some registers. The Intel 8080 and GameBoy CPU have six 8-bit general purpose registers, an accumulator, flags, stack pointer and program counter. 16-bit access is also provided to each general purpose register and the accumulator and flags registers in sequential pairs. Additionally, the Z80 has two more 16-bit index registers, an alternative set of each general purpose, accumulator and flags registers and a few more bits and pieces.

Let’s start by defining the general purpose register set.

```C#
/// <summary>
/// General purpose Intel 8080 registers B, C, D, E, H & L. Also their 16-bit equivalents BC, DE & HL.
/// </summary>
public class GeneralPurposeRegisterSet
{
    public byte B { get; set; }

    public byte C { get; set; }

    public byte D { get; set; }

    public byte E { get; set; }

    public byte H { get; set; }

    public byte L { get; set; }
    
    public ushort BC
    {
        get => BitConverterHelpers.To16Bit(B, C);
        set
        {
            var bytes = BitConverterHelpers.To8Bit(value);
            B = bytes[1];
            C = bytes[0];
        }
    }

    public ushort DE
    {
        get => BitConverterHelpers.To16Bit(D, E);
        set
        {
            var bytes = BitConverterHelpers.To8Bit(value);
            D = bytes[1];
            E = bytes[0];
        }
    }

    public ushort HL
    {
        get => BitConverterHelpers.To16Bit(H, L);
        set
        {
            var bytes = BitConverterHelpers.To8Bit(value);
            H = bytes[1];
            L = bytes[0];
        }
    }
}
```

We can define the accumulator and flags similarly.

```C#
/// <summary>
/// The flags register, F.
/// </summary>
public interface IFlagsRegister
{
    /// <summary>
    /// The byte value of the F register, constructed from the component flags
    /// </summary>
    byte Register { get; set; }

    /// <summary>
    /// S - Sign flag
    /// Set if the 2-complement value is negative (copy of MSB)
    /// </summary>
    bool Sign { get; set; }

    /// <summary>
    /// Z - Zero flag
    /// Set if the value is zero
    /// </summary>
    bool Zero { get; set; }

    /// <summary>
    /// F5 - undocumented flag
    /// Copy of bit 5
    /// </summary>
    bool Flag5 { get; set; }

    /// <summary>
    /// H - Half Carry
    /// Carry from bit 3 to bit 4
    /// </summary>
    bool HalfCarry { get; set; }

    /// <summary>
    /// F3 - undocumented flag
    /// Copy of bit 3
    /// </summary>
    bool Flag3 { get; set; }

    /// <summary>
    /// P/V - Parity or Overflow
    /// Parity set if even number of bits set
    /// Overflow set if the 2-complement result does not fit in the register
    /// </summary>
    bool ParityOverflow { get; set; }

    /// <summary>
    /// N - Subtract
    /// Set if the last operation was a subtraction
    /// </summary>
    bool Subtract { get; set; }

    /// <summary>
    /// C - Carry
    /// Set if the result did not fit in the register
    /// </summary>
    bool Carry { get; set; }
}
```

```C#
/// <summary>
/// The accumulator and flags registers.
/// </summary>
public class AccumulatorAndFlagsRegisterSet
{
    public AccumulatorAndFlagsRegisterSet(IFlagsRegister flagsRegister)
    {
        Flags = flagsRegister;
    }

    public byte A { get; set; }
    
    public IFlagsRegister Flags { get; }
    
    public ushort AF
    {
        get { return BitConverterHelpers.To16Bit(A, Flags.Register); }
        set
        {
            var bytes = BitConverterHelpers.To8Bit(value);
            A = bytes[1];
            Flags.Register = bytes[0];
        }
    }
}
```

To simplify the rest of the system, we will access the registers via an interface conforming to the full Z80 specification.

```C#
public interface IRegisters
{
    GeneralPurposeRegisterSet GeneralPurposeRegisters { get; }

    AccumulatorAndFlagsRegisterSet AccumulatorAndFlagsRegisters { get; }

    ushort StackPointer { get; set; }

    ushort ProgramCounter { get; set; }

    // Some more Z80 specific stuff omitted for brevity
}
```

We’ll have two implementations of this interface; one for each platform. The Z80 implementation will have full functionality whereas the Intel 8080/GameBoy implementation will throw when calling methods or properties that are not supported by the platform. It will be the responsibility of the CPU core implementation to configure the correct platform based access to registers.

#### Address space

Next we need to implement the memory management unit (MMU) to broker access to the address space.

![Simple diagram of the GameBoy MMU](/assets/images/gameboy-cpu/MMU.svg)

An MMU should support reading and writing data as either bytes and words across the entire address space whilst abstracting away the hardware that is physically attached to each location in the space.

```C#
public interface IMmu : IDisposable
{
    byte ReadByte(ushort address);

    ushort ReadWord(ushort address);

    byte[] ReadBytes(ushort address, int length);

    void WriteByte(ushort address, byte value);

    void WriteWord(ushort address, ushort word);

    void WriteBytes(ushort address, byte[] bytes);
}
```

We can implement an MMU in a platform agnostic way by introducing a concept of segments. A segment has a location and length so that it can be positioned in the address space and will provide implementation specific data access operations. For example, most GameBoy cartridges have a microcontroller acting as a memory bank controller (MBC) over multiple banks of read only memory (ROM). Read requests for data in an MBC address space will be forwarded to a configured page of ROM, whereas write requests will change which page is configured.

```C#
public enum MemoryBankType
{
    /// <summary>
    /// An unused memory bank.
    /// </summary>
    Unused,

    /// <summary>
    /// A random access memory bank (RAM).
    /// </summary>
    RandomAccessMemory,

    /// <summary>
    /// A read only memory bank (ROM).
    /// </summary>
    ReadOnlyMemory,

    /// <summary>
    /// A peripheral e.g. a hardware register.
    /// </summary>
    Peripheral,

    /// <summary>
    /// A read only memory bank (ROM) with bank switching support.
    /// </summary>
    BankedReadOnlyMemory
}
```

```C#
public interface IAddressSegment
{
    MemoryBankType Type { get; }

    ushort Address { get; }

    ushort Length { get; }
}
```

```C#
public interface IReadableAddressSegment : IAddressSegment
{
    byte ReadByte(ushort address);

    ushort ReadWord(ushort address);

    byte[] ReadBytes(ushort address, int length);

    void ReadBytes(ushort address, byte[] buffer);
}
```

```C#
public interface IWriteableAddressSegment : IAddressSegment
{
    void WriteByte(ushort address, byte value);

    void WriteWord(ushort address, ushort word);

    void WriteBytes(ushort address, byte[] values);
}
```

It is the responsibility of the platform to wire up the correct segments and their implementations. For example, a very simple segment that represents random access memory (RAM) could be implemented using a byte array:

```C#
public class ArrayBackedMemoryBank : IReadableAddressSegment, IWriteableAddressSegment
{
    protected readonly byte[] Memory;

    public ArrayBackedMemoryBank()
    {
        Memory = new byte[1024];
        Type = MemoryBankType.RandomAccessMemory;
        Address = 0x000;
        Length = 0x1000;
    }

    public MemoryBankType Type { get; }

    public ushort Address { get; }

    public ushort Length { get; }

    public byte ReadByte(ushort address) => Memory[address];

    public ushort ReadWord(ushort address) => BitConverter.ToUInt16(Memory, address);

    public byte[] ReadBytes(ushort address, int length)
    {
        var bytes = new byte[length];
        Array.Copy(Memory, address, bytes, 0, length);
        return bytes;
    }

    public void ReadBytes(ushort address, byte[] buffer) => Array.Copy(Memory, address, buffer, 0, buffer.Length);

    public void WriteByte(ushort address, byte value) => Memory[address] = value;

    public void WriteWord(ushort address, ushort word)
    {
        var bytes = BitConverter.GetBytes(word);
        Memory[address] = bytes[0];
        Memory[address + 1] = bytes[1];
    }

    public void WriteBytes(ushort address, byte[] values) => Array.Copy(values, 0, Memory, address, values.Length);
}
```

#### Core

A CPU runs on a fetch-decode-execute cycle, called the machine cycle or m-cycle. The CPU will initially fetch a byte, whose location in the address space is pointed to by the program counter register (PC), decode it as an instruction (opcode) and execute it, or contextually use it as a literal for a previous cycle. Opcodes not related to absolute program flow, such as jumps or calls, will end a cycle by incrementing the program counter to point at the next byte in the address space. Opcode length is variable so some cycles are consumed simply decoding the next part of the opcode. Some operations run in a single cycle, but others require multiple fetch-decode-execute cycles to run. Opcodes are specified by the official Zilog Z80 documentation. Here’s an example of running three simple opcodes on a Z80:

![Simple diagram of the GameBoy CPU](/assets/images/gameboy-cpu/CPU.svg)

We’re not really concerned with this low level cycle as software cannot control it, but we do need to keep track of how many have occurred so that we have a mechanism to match (approximate) platform timing. Our higher level cycle will be based on a concept of an operation, which can be represented by one or more opcodes and optional literals.

Each operation cycle will:

1. Fetch the next opcode.
2. Decode the fetched opcode.
3. Fetch any extra data required to resolve the operation including extra opcodes and literals.
4. Record all m-cycles consumed in the operation so that we can block later to adjust our timings.
5. Execute the opcode.

Naively this can be implemented as a while loop with a massive switch statement to handle the opcodes.