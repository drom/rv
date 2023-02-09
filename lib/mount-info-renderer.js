'use strict';

const renderer = require('onml/renderer');

const {StyleModule} = require('style-mod');

const infoTheme = require('./info-theme.js');

const exto = require('./exto.js');

const isaLangWith = require('riscv/lib/isa-lang-with.js');
const langParser = require('riscv/lib/lang-parser.js');

const renderRow = (row) => {
  const {name, kind, major, minor, count, desc, ver} = row;
  const res = ['div', {class: 'row'}];
  res.push(['span', {class: kind + 'ext'}, name]);
  if ((major !== undefined) || (minor !== undefined)) {
    res.push(['span', {class: 'version'}, 'v' + major + (minor ? ('.' + minor) : '')]);
  } else
  if (ver) { res.push(['span', {class: 'ver'}, 'v' + ver]); }
  if (count) { res.push(['span', {class: 'count'}, count]); }
  if (desc) { res.push(['span', {class: 'desc'}, desc]); }
  return res;
};

const ext = (row) => {
  const {name, kind, major, minor} = row;
  const extDesc = exto[name.toLowerCase()] || {};
  if (Array.isArray(extDesc)) {
    return [['div', {class: 'group'},
      ['span', {class: 'ext'}, name],
      ...extDesc.map(row => renderRow({
        name: row.id,
        kind: ['z', 's', 'x'].find(e => row.id[0] === e) || 'b',
        desc: row.desc,
        major,
        minor,
        ver: row.ver
      }))
    ]];
  } else {
    return [renderRow({
      name,
      kind,
      major,
      minor,
      desc: extDesc.desc,
      ver: extDesc.ver
    })];
  }
};

const isaBrief = (state) => ['div',
  ['div', {class: 'row'}, 'XLEN = ' + state.xlen],
  ...state.body.flatMap((row) => {
    if (row.error) {
      return [['div', {class: 'row'},
        ['span', {class: 'error'}, row.error + ' at: ' + row.start]
      ]];
    }
    return ext(row);
  })
];

const mountInfoRenderer = (div) => {
  const themeAllMod = new StyleModule(infoTheme);
  StyleModule.mount(document, themeAllMod);
  const render = renderer(div);
  const fn = (str) => {
    const parser = langParser(isaLangWith());
    const state = parser(str);
    // console.log(state);
    const ml = isaBrief(state);
    // console.log(ml);
    render(ml);
  };
  return fn;
};

module.exports = mountInfoRenderer;

/* eslint-env browser */
