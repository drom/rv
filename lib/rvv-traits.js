'use strict';

const rvvTraits = [
  {ch: '32.7',      m: /^v(?<a>[ls])\w+(?<c>.v)$/,                  desc: 'Vector Loads and Stores'},
  {ch: '32.7.4',    m: /^v[ls](?<b>e(8|16|32|64)|m).v$/,            desc: 'Vector Unit-Stride Instructions'},
  {ch: '32.7.5',    m: /^v[ls](?<a>s)(?<b>e(8|16|32|64)).v$/,       desc: 'Vector Strided Instructions'},
  {ch: '32.7.6',    m: /^v[ls](?<a>[uo]xe)(?<b>i(8|16|32|64)).v$/,  desc: 'Vector Indexed Instructions'},
  {ch: '32.7.7',    m: /^vl(?<b>e(8|16|32|64))(?<c>ff).v$/,         desc: 'Unit-stride Fault-Only-First Loads'},
  {ch: '32.7.8',    m: /^v[ls]\w*(?<a>seg)(?<b>\d)e[i]?\d+\w*.v$/,  desc: 'Vector Load/Store Segment Instructions'},
  {ch: '32.7.8.1',  m: /^v[ls]seg\d(?<a>e\d+)(?<c>ff)?.v$/,         desc: 'Vector Unit-Stride Segment Loads and Stores'},
  {ch: '32.7.8.2',  m: /^v[ls](?<a>s)seg\d(?<b>\w+).v$/,            desc: 'Vector Strided Segment Loads and Stores'},
  {ch: '32.7.8.3',  m: /^v[ls](?<a>[ou]x)seg\d(?<b>\w+).v$/,        desc: 'Vector Indexed Segment Loads and Stores'},
  {ch: '32.7.9',    m: /^v[ls](?<a>\d)(?<b>r\w*).v$/,               desc: 'Vector Load/Store Whole Register Instructions'},

  {ch: '32.10',     m: /^(?<a>v[f])?\w+(?<b>.[vw][vxfi])$/,         desc: 'Vector Arithmetic Instruction Formats'},
  {ch: '32.10.2',   m: /^v[f]?(?<a>w)\w+(?<b>.[vw][vxfi])$/,        desc: 'Widening Vector Arithmetic Instructions'},
  {ch: '32.10.3',   m: /^v[f]?(?<a>n)[^m]\w+(?<b>.[vw][vxfi])$/,    desc: 'Narrowing Vector Arithmetic Instructions'},

  // Integer
  {ch: '32.11.1',   m: /^v(?<a>add|sub|rsub).v[vxi]$/,              desc: 'Vector Single-Width Integer Add and Subtract'},
  {ch: '32.11.2',   m: /^v(?<a>w(add|sub)[u]?).[vw][vx]$/,          desc: 'Vector Widening Integer Add/Subtract'},
  {ch: '32.11.3',   m: /^v(?<a>[sz]ext)(?<b>.vf\d)$/,               desc: 'Vector Integer Extension'},
  {ch: '32.11.4',   m: /^v(?<a>[m]?(adc|sbc)).v[vxi][m]?$/,         desc: 'Vector Integer Add-with-Carry / Subtract-with-Borrow Instructions'},
  {ch: '32.11.5',   m: /^v(?<a>and|or|xor).v[vxi]$/,                desc: 'Vector Bitwise Logical Instructions'},
  {ch: '32.11.6',   m: /^v(?<a>s(ll|rl|ra)).v[vxi]$/,               desc: 'Vector Single-Width Shift Instructions'},
  {ch: '32.11.7',   m: /^v(?<a>nsr[la]).w[vxi]$/,                   desc: 'Vector Narrowing Integer Right Shift Instructions'},
  {ch: '32.11.8',   m: /^v(?<a>ms)(?<b>eq|ne|ltu|lt|leu|le|gtu|gt).v[vxi]$/,  desc: 'Vector Integer Compare Instructions'},
  {ch: '32.11.9',   m: /^v(?<a>(min|max)[u]?).v[vx]$/,              desc: 'Vector Integer Min/Max Instructions'},
  {ch: '32.11.10',  m: /^v(?<a>mul(h|hu|hsu)?).v[vx]$/,             desc: 'Vector Single-Width Integer Multiply Instructions'},
  {ch: '32.11.11',  m: /^v(?<a>(div|rem)[u]?).v[vx]$/,              desc: 'Vector Integer Divide Instructions'},
  {ch: '32.11.12',  m: /^v(?<a>wmul([s]?u)?).v[vx]$/,               desc: 'Vector Widening Integer Multiply Instructions'},
  {ch: '32.11.13',  m: /^v(?<a>macc|nmsac|madd|nmsub).v[vx]$/,      desc: 'Vector Single-Width Integer Multiply-Add Instructions'},
  {ch: '32.11.14',  m: /^v(?<a>wmacc(u|su|us)?).v[vx]$/,            desc: 'Vector Widening Integer Multiply-Add Instructions'},
  {ch: '32.11.15',  m: /^v(?<a>merge).v[vxi]m$/,                    desc: 'Vector Integer Merge Instructions'},
  {ch: '32.11.16',  m: /^v(?<a>mv)(?<b>(.v)).[vxi]$/,               desc: 'Vector Integer Move Instructions'},

  // Fixed-Point
  {ch: '32.12',     m: /^v(?<a>[as])(add|sub|mul)u?.v[vix]$/,       desc: 'Vector Fixed-Point Arithmetic Instructions'},
  {ch: '32.12.1',   m: /^v(?<a>s)(?<b>add|sub)(?<c>u?).v[vix]$/,    desc: 'Vector Single-Width Saturating Add and Subtract'},
  {ch: '32.12.2',   m: /^v(?<a>a)(?<b>add|sub)(?<c>u?).v[vix]$/,    desc: 'Vector Single-Width Averaging Add and Subtract'},
  {ch: '32.12.3',   m: /^v(?<a>s)(?<b>mul).v[vx]$/,                 desc: 'Vector Single-Width Fractional Multiply with Rounding and Saturation'},
  {ch: '32.12.4',   m: /^v(?<a>s)(?<b>sr[la]).v[vix]$/,             desc: 'Vector Single-Width Scaling Shift Instructions'},
  {ch: '32.12.5',   m: /^v(?<a>n)(?<b>clip)(?<c>u?).w[vix]$/,       desc: 'Vector Narrowing Fixed-Point Clip Instructions'},

  // Floating-Point
  {ch: '32.13',     m: /^v(?<a>f)\w+.(v[vf]?[m]?|w[vf])$/,          desc: 'Vector Floating-Point Instructions'},
  {ch: '32.13.2',   m: /^vf(?<a>add|sub|rsub).v[vf]$/,              desc: 'Vector Single-Width Floating-Point Add/Subtract Instructions'},
  {ch: '32.13.3',   m: /^vf(?<a>w(add|sub)).(v[vf]|w[vf])$/,        desc: 'Vector Widening Floating-Point Add/Subtract Instructions'},
  {ch: '32.13.4',   m: /^vf(?<a>mul|div|rdiv).v[vf]$/,              desc: 'Vector Single-Width Floating-Point Multiply/Divide Instructions'},
  {ch: '32.13.5',   m: /^vf(?<a>wmul).v$/,                          desc: 'Vector Widening Floating-Point Multiply'},
  {ch: '32.13.6',   m: /^vf(?<a>(n?)m(acc|sac|add|sub)).v[vf]$/,    desc: 'Vector Single-Width Floating-Point Fused Multiply-Add Instructions'},
  {ch: '32.13.7',   m: /^vf(?<a>w(n?)m(acc|sac)).v[vf]$/,           desc: 'Vector Widening Floating-Point Fused Multiply-Add Instructions'},
  {ch: '32.13.8',   m: /^vf(?<a>sqrt).v$/,                          desc: 'Vector Floating-Point Square-Root Instruction'},
  {ch: '32.13.9',   m: /^vf(?<a>rsqrt7).v$/,                        desc: 'Vector Floating-Point Reciprocal Square-Root Estimate Instruction'},
  {ch: '32.13.10',  m: /^vf(?<a>rec7).v$/,                          desc: 'Vector Floating-Point Reciprocal Estimate Instruction'},
  {ch: '32.13.11',  m: /^vf(?<a>min|max).v[vf]$/,                   desc: 'Vector Floating-Point MIN/MAX Instructions'},
  {ch: '32.13.12',  m: /^vf(?<a>sgnj[nx]?).v[vf]$/,                 desc: 'Vector Floating-Point Sign-Injection Instructions'},
  {ch: '32.13.13',  m: /^v(?<a>m)f(?<b>eq|ne|lt|le|gt|ge).v[vf]$/,  desc: 'Vector Floating-Point Compare Instructions'},
  {ch: '32.13.14',  m: /^vf(?<a>class).v$/,                         desc: 'Vector Floating-Point Classify Instruction'},
  {ch: '32.13.15',  m: /^vf(?<a>merge).vfm$/,                       desc: 'Vector Floating-Point Merge Instruction'},
  {ch: '32.13.16',  m: /^vf(?<a>mv).v.f$/,                          desc: 'Vector Floating-Point Move Instruction'},
  {ch: '32.13.17',  m: /^vf(?<a>cvt)(.rtz)?.(xu|x|f).(f|xu|x).v$/,  desc: 'Single-Width Floating-Point/Integer Type-Convert Instructions'},
  {ch: '32.13.18',  m: /^vf(?<a>wcvt)(.rtz)?.(xu|x|f).(f|xu|x).v$/, desc: 'Widening Floating-Point/Integer Type-Convert Instructions'},
  {ch: '32.13.19',  m: /^vf(?<a>ncvt)(.rtz)?.(xu|x|f).(f|xu|x).w$/, desc: 'Narrowing Floating-Point/Integer Type-Convert Instructions'},

  // Reduction
  {ch: '32.14',     m: /^v[f]?[w]?(?<a>red)\w+(?<c>.vs)$/,          desc: 'Vector Reduction Operations'},

  {ch: '32.14.1',   m: /^v(?<a>red)\w+.vs$/,                        desc: 'Vector Single-Width Integer Reduction Instructions'},
  {ch: '32.14.2',   m: /^v(?<a>wred)\w+.vs$/,                       desc: 'Vector Widening Integer Reduction Instructions'},

  {ch: '32.14.3',   m: /^v(?<a>fred)\w+.vs$/,                       desc: 'Vector Single-Width Floating-Point Reduction Instructions'},
  {ch: '32.14.3.1', m: /^vfred(?<b>osum).vs$/,                      desc: 'Vector Ordered Single-Width Floating-Point Sum Reduction'},
  {ch: '32.14.3.2', m: /^vfred(?<b>usum).vs$/,                      desc: 'Vector Single-Width Floating-Point Reduction Instructions'},
  {ch: '32.14.3.3', m: /^vfred(?<b>(max|min)).vs$/,                 desc: 'Vector Single-Width Floating-Point Reduction Instructions'},

  {ch: '32.14.4',   m: /^v(?<a>fwred)\w+.vs$/,                      desc: 'Vector Widening Floating-Point Reduction Instructions'},
];

module.exports = rvvTraits;
