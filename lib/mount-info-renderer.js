'use strict';

const renderer = require('onml/renderer');

const {StyleModule} = require('style-mod');

const infoTheme = require('./info-theme.js');

const exto = require('./exto.js');

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
