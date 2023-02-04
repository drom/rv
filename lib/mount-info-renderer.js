'use strict';

const renderer = require('onml/renderer');

const {StyleModule} = require('style-mod');

const infoTheme = require('./info-theme.js');

const exto = {
  '32i':      {id: '32i',       ver: 2.1, count: 37,  desc: 'integer instructions. XLEN = 32'},
  '32e':      {id: '32e',       ver: 2,   count: 37,  desc: 'integer instructions with 16 general-purpose registers. XLEN = 32'},
  '64i':      {id: '64i',       ver: 2.1, count: 49,  desc: 'integer instructions. XLEN = 64'},
  '64e':      {id: '64e',       ver: 2,   count: 49,  desc: 'integer instructions with 16 general-purpose registers. XLEN = 64'},
  '128i':     {id: '128i',      ver: 1.7, count: 52,  desc: 'integer instructions. XLEN = 128'},
  m:          {id: 'm',         ver: 2,   count: 8,   desc: 'integer multiplication and division'},
  a:          {id: 'a',         ver: 2.1, count: 11,  desc: 'atomic memory instructions'},
  f:          {id: 'f',         ver: 2.2, count: 26,  desc: 'single-precision floating-point instructions'},
  d:          {id: 'd',         ver: 2.2,             desc: 'double-precision floating-point instructions'},
  q:          {id: 'q',         ver: 2.2,             desc: 'quad-precision floating-point instructions'},
  v:          {id: 'v',         ver: 1,               desc: 'vector instructions'},
  c:          {id: 'c',         ver: 2,               desc: 'compressed instructions'},
  zicsr:      {id: 'Zicsr',     ver: 2,   count: 6,   desc: 'Control and Status Register (CSR) Instructions'},
  zifencei:   {id: 'Zifencei',  ver: 2,   count: 1,   desc: 'instruction-Fetch Fence'},
  zihintpause:{id: 'Zihintpause', ver: 2,            desc: 'Pause Hint'},
  zihintntl:  {id: 'Zihintntl', ver: 0.2,             desc: 'Non-Temporal Locality Hints'},
  zam:        {id: 'Zam',       ver: 0.1,             desc: 'Standard Extension for Misaligned Atomics'},
  zfh:        {id: 'Zfh',       ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'},
  zfhmin:     {id: 'Zfhmin',    ver: 1,               desc: 'Standard Extension for Half-Precision Floating-Point'},
  zfinx:      {id: 'Zfinx',     ver: 1,               desc: 'Standard Extension for single-precision Floating-Point in Integer Registers'},
  zdinx:      {id: 'Zdinx',     ver: 1,               desc: 'Standard Extension for double-precision Floating-Point in Integer Registers'},
  zhinx:      {id: 'Zhinx',     ver: 1,               desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},
  zhinxmin:   {id: 'Zhinxmin',  ver: 1,               desc: 'Standard Extension for half-precision Floating-Point in Integer Registers'},
  zmmul:      {id: 'Zmmul',     ver: 1,               desc: 'multiplication subset of the M extension'},
  ztso:       {id: 'Ztso',      ver: 1,               desc: 'Standard Extension for Total Store Ordering'},
};

exto['32g']  = [exto['32i'],  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];
exto['64g']  = [exto['64i'],  exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];
exto['128g'] = [exto['128i'], exto.m, exto.a, exto.f, exto.d, exto.zicsr, exto.zifencei];

const prefixes = {z: 'z', x: 'x', s: 's'};

const ext = (o, root) => {

  const {litera, major, minor} = o;

  const extDesc = exto[litera];
  let res;
  if (Array.isArray(extDesc)) {
    res = ['div', {class: 'group'}];
    res.push(['span', {class: 'ext'}, litera]);
    if (major) {
      res.push(['span', {class: 'version'}, 'v' + major + (minor ? ('.' + minor) : '')]);
    }
    extDesc.map(e => {
      const res1 = ['div', {class: 'row'}];

      res1.push(['span', {class: (prefixes[e.id.toLowerCase()] || '') + 'ext'}, e.id]);

      if (e.ver) {
        res1.push(['span', {class: 'ver'}, 'v' + e.ver]);
      }

      if (e.count) {
        res1.push(['span', {class: 'count'}, e.count]);
      }

      if (e.desc) {
        res1.push(['span', {class: 'desc'}, e.desc]);
      }

      res.push(res1);
    });
  } else {
    res = ['div', {class: 'row'}];
    res.push(['span', {class: (prefixes[litera[0].toLowerCase()] || '') + 'ext'}, litera]);

    if (major) {
      res.push(['span', {class: 'version'}, 'v' + major + (minor ? ('.' + minor) : '')]);
    } else
    if (extDesc && extDesc.ver) {
      res.push(['span', {class: 'ver'}, 'v' + extDesc.ver]);
    }

    if (extDesc && extDesc.count) {
      res.push(['span', {class: 'count'}, extDesc.count]);
    }

    if (extDesc && extDesc.desc) {
      res.push(['span', {class: 'desc'}, extDesc.desc]);
    }
  }
  root.push(res);


  // if (o.ver) {
  //   res.push(['span', {class: 'version'}, 'v' + o.ver]);
  // }
  // if (o.count) {
  //   res.push(['span', {class: 'count'}, o.count]);
  // }
  // if (o.desc) {
  //   res.push(['span', {class: 'desc'}, o.desc]);
  // }
  // return [res];
};


const parse = (str) => {
  const res = ['div'];
  let pos = 0;
  {
    const m = str.match(/^([Rr][Vv](?<litera>(32|64)[eEiIgG]|128[iIgG])((?<major>\d+)(p(?<minor>\d+))?)?)/);
    console.log(m);
    if (m) {
      const len = m[0].length;
      str = str.slice(len);
      pos += len;
      ext(m.groups, res);
    } else {
      res.push(['div',
        ['span', {class: 'error'}, 'ERROR: [' + pos + ']'],
        ' RISC-V ISA string must begin with either ',
        ['span', {class: 'ext'}, 'RV32I'],
        ', ',
        ['span', {class: 'ext'}, 'RV32E'],
        ', ',
        ['span', {class: 'ext'}, 'RV64I'],
        ', or ',
        ['span', {class: 'ext'}, 'RV128I'],
        ' indicating the supported address space size in bits for the base integer ISA.'
      ]);
      return res;
    }
  }
  while (true) {
    const m = str.match(/^_?(?<litera>[a-yA-Y])((?<major>\d+)(p(?<minor>\d+))?)?/);
    console.log(m);
    if (!m) {
      break;
    }
    const len = m[0].length;
    str = str.slice(len);
    pos += len;
    ext(m.groups, res);
  }
  while (true) {
    const m = str.match(/^_(?<litera>[zZsS][a-yA-Y]+)((?<major>\d+)(p(?<minor>\d+))?)?/);
    console.log(m);
    if (!m) {
      break;
    }
    const len = m[0].length;
    str = str.slice(len);
    pos += len;
    ext(m.groups, res);
  }
  while (true) {
    const m = str.match(/^_(?<litera>[xX][a-zA-Z]+)((?<major>\d+)(p(?<minor>\d+))?)?/);
    console.log(m);
    if (!m) {
      break;
    }
    const len = m[0].length;
    str = str.slice(len);
    pos += len;
    ext(m.groups, res);
  }
  return res;
};


const mountInfoRenderer = (div) => {
  const themeAllMod = new StyleModule(infoTheme);
  StyleModule.mount(document, themeAllMod);
  const render = renderer(div);
  const fn = (str) => {
    render(parse(str));
  };
  return fn;
};

module.exports = mountInfoRenderer;

/* eslint-env browser */
