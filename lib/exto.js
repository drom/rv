'use strict';

const exto = {
  i:            {ver: 2.1, count: 37,  desc: 'Base Integer Instruction Set'},  // Ch.2

  zifencei:     {ver:   2, count: 1,   desc: 'instruction-Fetch Fence'}, // Ch.3
  zihintntl:    {ver: 0.2,             desc: 'Non-Temporal Locality Hints'}, // Ch.4
  zihintpause:  {ver:   2,             desc: 'Pause Hint'}, // Ch.5

  // RV32E and RV64E Base Integer Instruction Sets, Version 2.0 // Ch.6
  e:            {ver: 2,   count: 37,  desc: 'Base Integer Instruction Set with 16 general-purpose registers. XLEN = 32'},
  // '64e':      {id: '64e',       ver: 2,   count: 49,  desc: 'Base Integer Instruction Set with 16 general-purpose registers. XLEN = 64'},

  // '64i':      {id: '64i',       ver: 2.1, count: 49,  desc: 'Base Integer Instruction Set. XLEN = 64'}, // CH.7
  // '128i':     {id: '128i',      ver: 1.7, count: 52,  desc: 'Base Integer Instruction Set. XLEN = 128'}, // Ch.8

  // Ch.9
  m:            {ver: 2,   count: 8,   desc: 'Standard Extension for Integer Multiplication and Division'},
  zmmul:        {ver: 1.0, count: 4 /* 5 */, desc: 'Standard Extension for Integer Multiplication'}, // Ch.9.3

  a:            {ver: 2.1, count: 11,  desc: 'Standard Extension for Atomic Instructions'}, // Ch.10
  zicsr:        {ver: 2,   count: 6,   desc: 'Control and Status Register (CSR) Instructions'}, // Ch.11

  // "Zicntr" and "Zihpm" Counters // Ch.12
  zicntr:       {ver: 2.1,             desc: 'Standard Extension for Base Counters and Timers'}, // 12.1
  zihpm:        {ver: 2.1,             desc: 'Standard Extension for Hardware Performance Counters'}, // 12.2

  f:            {ver: 2.2, count: 26,  desc: 'Standard Extension for Single-Precision Floating-Point'}, // Ch.13
  d:            {ver: 2.2,             desc: 'Standard Extension for Double-Precision Floating-Point'}, // CH.14
  q:            {ver: 2.2,             desc: 'Standard Extension for Quad-Precision Floating-Point'}, // Ch.15

  zfh:          {ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'}, // Ch.16
  zfhmin:       {ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'}, // Ch.16.6

  c:            {ver: 2,               desc: 'Standard Extension for Compressed Instructions'}, // Ch.18
  // ['rv_c_zihintntl', 'u', 2.0, `HINT Instructions`], // Ch.18.7

  b:      {desc: 'Standard Extension for Bit Manipulation'}, // Ch.19
  zba:    {desc: 'Bit Manipulation; Address generation instructions'},
  zbb:    {desc: 'Basic bit-manipulation'},
  zbc:    {desc: 'Bit Manipulation; Carry-less multiplication'},
  zbs:    {desc: 'Bit Manipulation; Single-bit instructions'},
  zbe:    {desc: 'Bit Manipulation'},
  zbf:    {desc: 'Bit Manipulation'},

  zbkb:   {desc: 'Bit-manipulation for Cryptography'},
  zbkc:   {desc: 'Bit Manipulation; Carry-less multiplication for Cryptography'},
  zbkx:   {desc: 'Bit Manipulation; Crossbar permutations'},
  zk:     {desc: 'Bit Manipulation'},
  zknh:   {desc: 'Bit Manipulation'},
  zkn:    {desc: 'Bit Manipulation'},
  zks:    {desc: 'Bit Manipulation'},
  zksed:  {desc: 'Bit Manipulation'},
  zksh:   {desc: 'Bit Manipulation'},
  zknd:   {desc: 'Bit Manipulation'},
  zkne:   {desc: 'Bit Manipulation'},
  zbm:    {desc: 'Bit Manipulation'},
  zbp:    {desc: 'Bit Manipulation'},
  zbpbo:  {desc: 'Bit Manipulation'},
  zbr:    {desc: 'Bit Manipulation'},
  zbt:    {desc: 'Bit Manipulation'},

  // "J" Standard Extension for Dynamically Translated Languages, Version 0.0 // Ch.20

  // "P" Standard Extension for Packed-SIMD Instructions, Version 0.2 // Ch.21

  zpn:  {desc: 'Standard Extension for Packed-SIMD Instructions'},
  zpsf: {desc: 'Standard Extension for Packed-SIMD Instructions'},

  v:    {ver: 1, desc: 'Standard Extension for Vector Operations'}, // Ch.22

  zam:  {ver: 0.1, desc: 'Standard Extension for Misaligned Atomics'}, // Ch.23

  // "Zfinx", "Zdinx", "Zhinx", "Zhinxmin": Standard Extensions for Floating-Point in Integer Registers, Version 1.0 // Ch.24
  zfinx:    {ver: 1, desc: 'Standard Extension for single-precision Floating-Point in Integer Registers'},
  zdinx:    {ver: 1, desc: 'Standard Extension for double-precision Floating-Point in Integer Registers'},
  zhinx:    {ver: 1, desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},
  zhinxmin: {ver: 1, desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},

  zfa:  {ver: 0.1, desc: 'Standard Extension for Additional Floating-Point Instructions'}, // Ch.25

  ztso: {ver: 1, desc: 'Standard Extension for Total Store Ordering'}, // Ch.26

  // RV32/64G Instruction Set Listings // Ch.27

  // Zc v1.0.2
  zc:     {ver: '1.0.2', desc: ''},
  zcf:    {ver: 2.0,     desc: ''},
  zcd:    {ver: '1.0.2', desc: ''},
  zcb:    {ver: '1.0.2', desc: ''},
  zcmp:   {ver: '1.0.2', desc: ''},
  zccmt:  {ver: '1.0.2', desc: ''},

  zicbom: {ver: '1.0.2', desc: 'cache-block management instructions'},
  zicboz: {ver: '1.0.2', desc: 'cache-block zero instruction'},
  zicbop: {ver: '1.0.2', desc: 'prefetch hint pseudoinstructions'},

  // https://github.com/riscv/riscv-zawrs
  zawrs:    {ver: 0, desc: 'Wait-on-Reservation-Set extension'},

  sv32:     {desc: 'Page-Based 32-bit Virtual-Memory System'},
  sv39:     {desc: 'Page-Based 39-bit Virtual-Memory System'},
  sv48:     {desc: 'Page-Based 47-bit Virtual-Memory System'},
  sv57:     {desc: 'Page-Based 57-bit Virtual-Memory System'},

  svpbmt:   {ver: 1, desc: 'Standard Extension for Page-Based Memory Types'},
  svnapot:  {ver: 1, desc: 'Standard Extension for NAPOT Translation Contiguity'},
  svinval:  {ver: 1, desc: 'Standard Extension for Fine-Grained Address-Translation Cache Invalidation'}, // Ch.8

  sm:       {ver: '1.12', desc: 'Machine Architecture'},
  ss:       {ver: '1.12', desc: 'Supervisor Architecture'},

  sstc:     {             desc: 'Supervisor-mode Timer Interrupts'},
  sscofpmf: {ver: 0.5, desc: 'Supervisor-level Count Overflow and Mode-Based Filtering'},

  smstateen:    {desc: 'Extension for State-enable'},
  svbare:       {desc: 'Bare mode virtual-memory translation supported'},
  svade:        {desc: 'Raise exceptions on improper A/D bits'},
  ssccptr:      {desc: 'Main memory supports page table reads'},
  sscounterenw: {desc: 'Support writeable enables for any supported counter'},
  sstvecd:      {desc: 'stvec supports Direct mode'},
  sstvala:      {desc: 'stval provides all needed values'},
  ssu64xl:      {desc: 'UXLEN=64 must be supported'},
  ssstateen:    {desc: 'Supervisor-mode view of the state-enable extension'},
  shcounterenw: {desc: 'Support writeable enables for any supported counter'},
  shvstvala:    {desc: 'vstval provides all needed values'},
  shtvala:      {desc: 'htval provides all needed values'},
  shvstvecd:    {desc: 'vstvec supports Direct mode'},
  shvsatpa:     {desc: 'vsatp supports all modes supported by satp'},
  shgatpa:      {desc: 'SvNNx4 mode supported for all modes supported by satp, as well as Bare'},

};

exto.g  = [exto.i,  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];

Object.keys(exto).map(id => exto[id].id = id);

module.exports = exto;
