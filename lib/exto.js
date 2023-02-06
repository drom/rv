'use strict';

const exto = {
  '32i':      {id: '32i',       ver: 2.1, count: 37,  desc: 'integer instructions. XLEN = 32'},  // Ch.2

  zifencei:   {id: 'zifencei',  ver: 2,   count: 1,   desc: 'instruction-Fetch Fence'}, // Ch.3
  zihintntl:  {id: 'zihintntl', ver: 0.2,             desc: 'Non-Temporal Locality Hints'}, // Ch.4
  zihintpause:{id: 'zihintpause', ver: 2,             desc: 'Pause Hint'}, // Ch.5

  // RV32E and RV64E Base Integer Instruction Sets, Version 2.0 // Ch.6
  '32e':      {id: '32e',       ver: 2,   count: 37,  desc: 'Base Integer Instruction Set with 16 general-purpose registers. XLEN = 32'},
  '64e':      {id: '64e',       ver: 2,   count: 49,  desc: 'Base Integer Instruction Set with 16 general-purpose registers. XLEN = 64'},

  '64i':      {id: '64i',       ver: 2.1, count: 49,  desc: 'Base Integer Instruction Set. XLEN = 64'}, // CH.7
  '128i':     {id: '128i',      ver: 1.7, count: 52,  desc: 'Base Integer Instruction Set. XLEN = 128'}, // Ch.8

  // Ch.9
  m:          {id: 'm',         ver: 2,   count: 8,   desc: 'Standard Extension for Integer Multiplication and Division'},
  zmmul:      {id: 'zmmul',     ver: 1.0, count: 4 /* 5 */, desc: 'Standard Extension for Integer Multiplication'}, // Ch.9.3

  a:          {id: 'a',         ver: 2.1, count: 11,  desc: 'Standard Extension for Atomic Instructions'}, // Ch.10
  zicsr:      {id: 'zicsr',     ver: 2,   count: 6,   desc: 'Control and Status Register (CSR) Instructions'}, // Ch.11

  // "Zicntr" and "Zihpm" Counters // Ch.12
  zicntr:     {id: 'zicntr',    ver: 2.1,             desc: 'Standard Extension for Base Counters and Timers'}, // 12.1
  zihpm:      {id: 'zihpm',     ver: 2.1,             desc: 'Standard Extension for Hardware Performance Counters'}, // 12.2

  f:          {id: 'f',         ver: 2.2, count: 26,  desc: 'Standard Extension for Single-Precision Floating-Point'}, // Ch.13
  d:          {id: 'd',         ver: 2.2,             desc: 'Standard Extension for Double-Precision Floating-Point'}, // CH.14
  q:          {id: 'q',         ver: 2.2,             desc: 'Standard Extension for Quad-Precision Floating-Point'}, // Ch.15

  zfh:        {id: 'zfh',       ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'}, // Ch.16
  zfhmin:     {id: 'zfhmin',    ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'}, // Ch.16.6

  c:          {id: 'c',         ver: 2,               desc: 'Standard Extension for Compressed Instructions'}, // Ch.18
  // ['rv_c_zihintntl', 'u', 2.0, `HINT Instructions`], // Ch.18.7

  b:          {id: 'b',         ver: 1,               desc: 'Standard Extension for Bit Manipulation'}, // Ch.19
  zba:        {id: 'zba',       ver: 1,               desc: 'Bit Manipulation; Address generation instructions'},
  zbb:        {id: 'zbb',       ver: 1,               desc: 'Basic bit-manipulation'},
  zbc:        {id: 'zbc',       ver: 1,               desc: 'Bit Manipulation; Carry-less multiplication'},
  zbs:        {id: 'zbs',       ver: 1,               desc: 'Bit Manipulation; Single-bit instructions'},
  zbe:        {id: 'zbe',       ver: 0,               desc: 'Bit Manipulation'},
  zbf:        {id: 'zbf',       ver: 0,               desc: 'Bit Manipulation'},

  zbkb:       {id: 'zbkb',      ver: 0,               desc: 'Bit-manipulation for Cryptography'},
  zbkc:       {id: 'zbkc',      ver: 0,               desc: 'Bit Manipulation; Carry-less multiplication for Cryptography'},
  zbkx:       {id: 'zbkx',      ver: 0,               desc: 'Bit Manipulation; Crossbar permutations'},
  zk:         {id: 'zk',        ver: 0,               desc: 'Bit Manipulation'},
  zknh:       {id: 'zknh',      ver: 0,               desc: 'Bit Manipulation'},
  zkn:        {id: 'zkn',       ver: 0,               desc: 'Bit Manipulation'},
  zks:        {id: 'zks',       ver: 0,               desc: 'Bit Manipulation'},
  zksed:      {id: 'zksed',     ver: 0,               desc: 'Bit Manipulation'},
  zksh:       {id: 'zksh',      ver: 0,               desc: 'Bit Manipulation'},
  zknd:       {id: 'zknd',      ver: 0,               desc: 'Bit Manipulation'},
  zkne:       {id: 'zkne',      ver: 0,               desc: 'Bit Manipulation'},
  zbm:        {id: 'zbm',       ver: 0,               desc: 'Bit Manipulation'},
  zbp:        {id: 'zbp',       ver: 0,               desc: 'Bit Manipulation'},
  zbpbo:      {id: 'zbpbo',     ver: 0,               desc: 'Bit Manipulation'},
  zbr:        {id: 'zbr',       ver: 0,               desc: 'Bit Manipulation'},
  zbt:        {id: 'zbt',       ver: 0,               desc: 'Bit Manipulation'},

  // "J" Standard Extension for Dynamically Translated Languages, Version 0.0 // Ch.20

  // "P" Standard Extension for Packed-SIMD Instructions, Version 0.2 // Ch.21

  zpn:        {id: 'zpn',       ver: 0,               desc: 'Standard Extension for Packed-SIMD Instructions'},
  zpsf:       {id: 'zpsf',      ver: 0,               desc: 'Standard Extension for Packed-SIMD Instructions'},

  v:          {id: 'v',         ver: 1,               desc: 'Standard Extension for Vector Operations'}, // Ch.22

  zam:        {id: 'zam',       ver: 0.1,             desc: 'Standard Extension for Misaligned Atomics'}, // Ch.23

  // "Zfinx", "Zdinx", "Zhinx", "Zhinxmin": Standard Extensions for Floating-Point in Integer Registers, Version 1.0 // Ch.24
  zfinx:      {id: 'zfinx',     ver: 1,               desc: 'Standard Extension for single-precision Floating-Point in Integer Registers'},
  zdinx:      {id: 'zdinx',     ver: 1,               desc: 'Standard Extension for double-precision Floating-Point in Integer Registers'},
  zhinx:      {id: 'zhinx',     ver: 1,               desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},
  zhinxmin:   {id: 'zhinxmin',  ver: 1,               desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},

  zfa:        {id: 'zfa',       ver: 0.1,             desc: 'Standard Extension for Additional Floating-Point Instructions'}, // Ch.25

  ztso:       {id: 'ztso',      ver: 1,               desc: 'Standard Extension for Total Store Ordering'}, // Ch.26

  // RV32/64G Instruction Set Listings // Ch.27


  svinval:    {id: 'svinval',   ver: 1,               desc: 'Standard Extension for Fine-Grained Address-Translation Cache Invalidation'}, // Ch.8
  svnapot:    {id: 'svnapot',   ver: 1,               desc: 'Standard Extension for NAPOT Translation Contiguity'},
  // --> "Sv39"
  svpbmt:     {id: 'svpbmt',    ver: 1,               desc: 'Standard Extension for Page-Based Memory Types'},
  sscofpmf:   {id: 'sscofpmf',  ver: 0.5,             desc: 'Supervisor-level Count OverFlow and Privilege Mode Filtering'},


  // Zc v1.0.2
  zc:         {id: 'zc',        ver: '1.0.2',         desc: ''},
  zcf:        {id: 'zcf',       ver: 2.0,             desc: ''},
  zcd:        {id: 'zcd',       ver: '1.0.2',         desc: ''},
  zcb:        {id: 'zcb',       ver: '1.0.2',         desc: ''},
  zcmp:       {id: 'zcmp',      ver: '1.0.2',         desc: ''},
  zccmt:      {id: 'zccmt',     ver: '1.0.2',         desc: ''},

  zicbom:     {id: 'zicbom',    ver: '1.0.2',         desc: 'cache-block management instructions'},
  zicboz:     {id: 'zicboz',    ver: '1.0.2',         desc: 'cache-block zero instruction'},
  zicbop:     {id: 'zicbop',    ver: '1.0.2',         desc: 'prefetch hint pseudoinstructions'},

  // https://github.com/riscv/riscv-zawrs
  zawrs:      {id: 'zawrs',     ver: 0,               desc: 'Wait-on-Reservation-Set extension'}
};

exto['32g']  = [exto['32i'],  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];
exto['64g']  = [exto['64i'],  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];
exto['128g'] = [exto['128i'], exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];

module.exports = exto;
