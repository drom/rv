'use strict';

const cryptoDoc = 'https://github.com/riscv/riscv-crypto/blob/master/doc/';
const bitmanipDoc = 'https://github.com/riscv/riscv-bitmanip/blob/main/bitmanip/';
const vSpec = 'https://github.com/riscv/riscv-v-spec/blob/master/';
const fproxSubstack = 'https://fprox.substack.com/p/';
const profileDoc = 'https://github.com/riscv/riscv-profiles/blob/main/';

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
  m:      {ver: 2,   count: 8,   desc: 'Standard Extension for Integer Multiplication and Division'},
  zmmul:  {ver: 1.0, count: 4 /* 5 */, desc: 'Standard Extension for Integer Multiplication'}, // Ch.9.3

  a:      {ver: 2.1, count: 11,  desc: 'Standard Extension for Atomic Instructions'}, // Ch.10
  zicsr:  {ver: 2,   count: 6,   desc: 'Control and Status Register (CSR) Instructions'}, // Ch.11

  // "Zicntr" and "Zihpm" Counters // Ch.12
  zicntr: {ver: 2.1,             desc: 'Standard Extension for Base Counters and Timers'}, // 12.1
  zihpm:  {ver: 2.1,             desc: 'Standard Extension for Hardware Performance Counters'}, // 12.2

  f:      {ver: 2.2, count: 26,  desc: 'Standard Extension for Single-Precision Floating-Point'}, // Ch.13
  d:      {ver: 2.2,             desc: 'Standard Extension for Double-Precision Floating-Point'}, // CH.14
  q:      {ver: 2.2,             desc: 'Standard Extension for Quad-Precision Floating-Point'}, // Ch.15

  zfh:    {ver: 1,               desc: 'Full Half-Precision Floating-Point', url: fproxSubstack + 'riscv-zfh-half-support#§zfh-full-half-precision-support'}, // Ch.16
  zfhmin: {ver: 1,               desc: 'Reduced Half-Precision Floating-Point', url: fproxSubstack + 'riscv-zfh-half-support#§zfhmin-reduced-half-precision-support'}, // Ch.16.6

  zfbfmin: {desc: 'Scalar BF16 FP conversions'},

  c:      {ver: 2,               desc: 'Standard Extension for Compressed Instructions', url: fproxSubstack + 'riscv-c-extension'}, // Ch.18
  // ['rv_c_zihintntl', 'u', 2.0, `HINT Instructions`], // Ch.18.7

  b:      {desc: 'Standard Extension for Bit Manipulation'}, // Ch.19

  zba:    {desc: 'Bit Manipulation; Address generation instructions', url: bitmanipDoc + 'zba.adoc'},
  zbb:    {desc: 'Basic bit-manipulation', url: bitmanipDoc + 'zbb.adoc'},
  zbc:    {desc: 'Bit Manipulation; Carry-less multiplication', url: bitmanipDoc + 'zbc.adoc'},
  zbs:    {desc: 'Bit Manipulation; Single-bit instructions', url: bitmanipDoc + 'zbs.adoc'},

  zbe:    {desc: 'Bit Manipulation'},
  zbf:    {desc: 'Bit Manipulation'},
  zbm:    {desc: 'Bit Manipulation'},
  zbp:    {desc: 'Bit Manipulation'},
  zbpbo:  {desc: 'Bit Manipulation'},
  zbr:    {desc: 'Bit Manipulation'},
  zbt:    {desc: 'Bit Manipulation'},

  // https://github.com/riscv/riscv-crypto
  zkr:    {desc: 'Entropy Source Extension', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zkr.adoc'},
  zkt:    {desc: 'Data Independent Execution Latency', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zkt.adoc'},

  zknd:   {desc: 'NIST Suite: AES Decryption', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zknd.adoc'},
  zkne:   {desc: 'NIST Suite: AES Encryption', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zkne.adoc'},
  zknh:   {desc: 'NIST Suite: Hash Function Instructions', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zknh.adoc'},

  zbkb:   {desc: 'Bitmanip instructions for Cryptography', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zbkb.adoc'},
  zbkc:   {desc: 'Carry-less multiplication for Cryptography', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zbkc.adoc'},
  zbkx:   {desc: 'Crossbar permutation instructions', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zbkx.adoc'},

  zksed:  {desc: 'ShangMi Suite: SM4 Block Cipher Instructions', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zksed.adoc'},
  zksh:   {desc: 'ShangMi Suite: SM3 Hash Function Instructions', url: cryptoDoc + 'scalar/riscv-crypto-scalar-zksh.adoc'},

  // "J" Standard Extension for Dynamically Translated Languages, Version 0.0 // Ch.20

  // "P" Standard Extension for Packed-SIMD Instructions, Version 0.2 // Ch.21

  zpn:  {desc: 'Standard Extension for Packed-SIMD Instructions'},
  zpsf: {desc: 'Standard Extension for Packed-SIMD Instructions'},

  // Vector
  v:    {ver: 1, desc: 'Standard Extension for Vector Operations', url: fproxSubstack + 'risc-v-vector-in-a-nutshell'}, // Ch.22

  zve32x: {desc: 'Embedded Vector Computation (32-bit integer)'},
  zve32f: {desc: 'Embedded Vector Computation (32-bit integer, 32-bit FP)'},
  zve32d: {desc: 'Embedded Vector Computation (32-bit integer, 64-bit FP)'},
  zve64x: {desc: 'Embedded Vector Computation (64-bit integer)'},
  zve64f: {desc: 'Embedded Vector Computation (64-bit integer, 32-bit FP)'},
  zve64d: {desc: 'Embedded Vector Computation (64-bit integer, 64-bit FP)'},

  zvfh:     {desc: 'Vector half-precision floating-point (FP16)'},
  zvfhmin:  {desc: 'Vector FP16 conversion instructions.'},
  zvfbfmin: {desc: 'Vector BF16 FP conversions'},
  zvfbfwma: {desc: 'Vector BF16 widening mul-add'},

  // Vector Crypto
  zvkned:   {desc: 'Vector NIST Cipher AES encryption and decryption', url: fproxSubstack + 'risc-v-vector-cryptography-extensions'},
  zvknha:   {desc: 'Vector NIST SHA-256 Secure Hash', url: fproxSubstack + 'risc-v-vector-cryptography-extension'},
  zvknhb:   {desc: 'Vector NIST SHA-256 and SHA-512 Secure Hash', url: fproxSubstack + 'risc-v-vector-cryptography-extension'},
  zvkb:     {desc: 'Vector Crypto Bitmanip', url: fproxSubstack + 'risc-v-vector-cryptography-extension'},
  zvksh:    {desc: 'Vector Shang-Mi 3 Hash function (SM3)', url: fproxSubstack + 'risc-v-vector-cryptography-extension'},
  zvksed:   {desc: 'Vector Shang-Mi 4 Cipher (SM4) encryption and decryption', url: fproxSubstack + 'risc-v-vector-cryptography-extensions'},
  zvkg:     {desc: 'Vector GCM/GMAC', url: fproxSubstack + 'risc-v-vector-cryptography-extension'},

  zvl32b:   {desc: 'Minimum Vector Length = 32',    url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},
  zvl64b:   {desc: 'Minimum Vector Length = 64',    url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},
  zvl128b:  {desc: 'Minimum Vector Length = 128',   url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},
  zvl256b:  {desc: 'Minimum Vector Length = 256',   url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},
  zvl512b:  {desc: 'Minimum Vector Length = 512',   url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},
  zvl1024b: {desc: 'Minimum Vector Length = 1024',  url: vSpec + 'v-spec.adoc#zvl-minimum-vector-length-standard-extensions'},

  zvlsseg:  {desc: '[DEPRECATED] Vector segment load/stores supported'},

  zvamo:    {desc: 'Vector AMO', url: vSpec + 'v-amo.adoc'},

  zam:  {ver: 0.1, desc: 'Standard Extension for Misaligned Atomics'}, // Ch.23

  // "Zfinx", "Zdinx", "Zhinx", "Zhinxmin": Standard Extensions for Floating-Point in Integer Registers, Version 1.0 // Ch.24
  zfinx:    {ver: 1, desc: 'Standard Extension for single-precision Floating-Point in Integer Registers'},
  zdinx:    {ver: 1, desc: 'Standard Extension for double-precision Floating-Point in Integer Registers'},
  zhinx:    {ver: 1, desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},
  zhinxmin: {ver: 1, desc: 'Standard Extension for half-precision Floating-Point in Integer Registers (Minimal Subset)'},

  zfa:      {ver: 0.1, desc: 'Standard Extension for Additional Floating-Point Instructions'}, // Ch.25

  ztso:     {ver: 1, desc: 'Standard Extension for Total Store Ordering'}, // Ch.26

  // RV32/64G Instruction Set Listings // Ch.27

  // Zc v1.0.2
  zc:     {ver: '1.0',   desc: 'subsets of C', url: fproxSubstack + 'riscv-compressed-zc-extensions'},
  zca:    {ver: '1.0',   desc: 'C excl. c.f*', url: fproxSubstack + 'riscv-compressed-zc-extensions'},
  zcf:    {ver: '2.0',   desc: 'compressed single-precision floating-point load/stores', url: fproxSubstack + 'riscv-compressed-zc-extensions'},
  zcd:    {ver: '1.0.2', desc: 'compressed double-precision floating-point load/stores', url: fproxSubstack + 'riscv-compressed-zc-extensions'},
  zcb:    {ver: '1.0.2', desc: 'simple compact operations for use on all architectures', url: fproxSubstack + 'riscv-compressed-zc-extensions#%C2%A7zcb-extension'},
  zcmp:   {ver: '1.0.2', desc: 'compact PUSH/POP and double move', url: fproxSubstack + 'riscv-compressed-zc-extensions#%C2%A7zcmp-push-pop-and-paired-register-atomic-move'},
  zcmt:   {ver: '1.0.2', desc: 'compact jump', url: fproxSubstack + 'riscv-compressed-zc-extensions#%C2%A7zcmt-table-jump'},

  zicbom: {ver: '1.0.2', desc: 'cache-block management instructions'},
  zicboz: {ver: '1.0.2', desc: 'cache-block zero instruction'},
  zicbop: {ver: '1.0.2', desc: 'prefetch hint pseudoinstructions'},

  // Profile
  ziccif:   {desc: 'Main memory supports instruction fetch with atomicity requirement'},
  ziccrse:  {desc: 'Main memory supports forward progress on LR/SC sequences'},
  ziccamoa: {desc: 'Main memory supports all atomics in A'},
  zicclsm:  {desc: 'Main memory supports misaligned loads/stores'},
  za64rs:   {desc: 'Reservation set size of 64 bytes'},
  za128rs:  {desc: 'Reservation set size of 128 bytes'},
  zic64b:   {desc: 'Cache block size isf 64 bytes'},
  zjpm:     {desc: 'Pointer masking (ignore high bits of addresses)'},

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
  ssptead:      {desc: '[RENAMED] -> "svade" Raise exceptions on improper A/D bits'},

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

  smaia: {
    desc: 'Machine-level Advanced Interrupt Architecture',
    url: 'https://github.com/riscv/riscv-aia/blob/main/doc/src/intro.tex#L498'
  },
  ssaia: {
    desc: 'Supervisor-level Advanced Interrupt Architecture',
    url: 'https://github.com/riscv/riscv-aia/blob/main/doc/src/intro.tex#L501'
  }

};

exto.g = {
  desc: 'General-purpose set',
  items: [exto.i,  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei]
};

exto.zks = {
  desc: 'Crypto, ShangMi Algorithm Suite',
  url: cryptoDoc + 'scalar/riscv-crypto-scalar-zks.adoc',
  items: [exto.zbkb, exto.zbkc, exto.zbkx, exto.zksed, exto.zksh]
},

exto.zkn = {
  desc: 'Crypto, NIST Algorithm Suite',
  url: cryptoDoc + 'scalar/riscv-crypto-scalar-zkn.adoc',
  items: [exto.zbkb, exto.zbkc, exto.zbkx, exto.zkne, exto.zknd, exto.zknh]
},

exto.zk = {
  desc: 'Standard scalar cryptography extension',
  url: cryptoDoc + 'scalar/riscv-crypto-scalar-zk.adoc',
  items: [exto.zkn, exto.zkr, exto.zkt]
};

// Vector Crypto
exto.zvkn = {
  desc: 'Vector Crypto NIST Algorithm Suite',
  url: fproxSubstack + 'risc-v-vector-cryptography-extensions',
  items: [exto.zvkb, exto.zvkned, exto.zvknhb]
};

exto.zvks = {
  desc: 'Vector Crypto Shang-Mi Algorithm Suite',
  url: fproxSubstack + 'risc-v-vector-cryptography-extensions',
  items: [exto.zvkb, exto.zvksh, exto.zvksed]
};

// RISC-V profiles
exto.i20u = {
  desc: 'RVI20 unprivileged profile',
  items: [exto.i]
};

exto.i20u = {
  desc: 'RVI20 unprivileged profile',
  items: [exto.i]
};

exto.a20u = {
  desc: 'RVA20 user-mode profile for application processors',
  url: profileDoc + 'profiles.adoc#51-rva20u64-profile',
  items: [
    exto.i, exto.m, exto.a, exto.f, exto.d, exto.c, exto.zicsr, exto.zicntr,
    exto.ziccif, exto.ziccrse, exto.ziccamoa, exto.za128rs, exto.zicclsm
  ]
};

exto.a20s = {
  desc: 'RVA20 supervisor-mode profile for application processors',
  url: profileDoc + 'profiles.adoc#52-rva20s64-profile',
  items: [
    exto.i, exto.m, exto.a, exto.f, exto.d, exto.c, exto.zicsr, exto.zicntr,
    exto.ziccif, exto.ziccrse, exto.ziccamoa, exto.za128rs, exto.zicclsm,
    exto.zifencei, exto.svbare, exto.sv39, exto.svade, exto.ssccptr, exto.sstvecd, exto.sstvala
  ]
};

exto.a23u = {
  desc: 'RVA23 user-mode profile for application processors',
  url: fproxSubstack + 'risc-v-profile-rva23u64',
  items: [
    exto.i, exto.m, exto.a, exto.f, exto.d, exto.c, exto.zicsr, exto.zicntr,
    exto.zihpm, exto.ziccif, exto.ziccrse, exto.ziccamoa, exto.zicclsm, exto.za64rs,
    exto.zihintpause, exto.zba, exto.zbb, exto.zbs, exto.zic64b, exto.zicbom, exto.zicbop,
    exto.zicboz, exto.zfhmin, exto.zkt, exto.v, exto.zvfhmin, exto.zihintntl, exto.zcb,
    exto.zfa, exto.zawrs, exto.zjpm
  ]
};

exto.a23s = {
  desc: 'RVA23 supervisor-mode profile for application processors',
  url: profileDoc + 'rva23-profile.adoc#rva23s64-profile',
  items: [
    exto.i, exto.m, exto.a, exto.f, exto.d, exto.c, exto.zicsr, exto.zicntr,
    exto.zihpm, exto.ziccif, exto.ziccrse, exto.ziccamoa, exto.zicclsm, exto.za64rs,
    exto.zihintpause, exto.zba, exto.zbb, exto.zbs, exto.zic64b, exto.zicbom, exto.zicbop,
    exto.zicboz, exto.zfhmin, exto.zkt, exto.v, exto.zvfhmin, exto.zihintntl, exto.zcb,
    exto.zfa, exto.zawrs, exto.zjpm,
    exto.zifencei, exto.svbare, exto.sv39, exto.svade, exto.ssccptr, exto.sstvecd,
    exto.sstvala, exto.sscounterenw, exto.svpbmt, exto.svinval, exto.ssu64xl, exto.svnapot,
    exto.sstc
  ]
};

Object.keys(exto).map(id => {
  exto[id].id = id;
  const kind = ['z', 's', 'x'].find(e => e === id[0]) || 'b';
  exto[id].kind = kind;
});

module.exports = exto;
