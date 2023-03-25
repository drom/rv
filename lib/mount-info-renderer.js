'use strict';

const renderer = require('onml/renderer');

const {StyleModule} = require('style-mod');

const infoTheme = require('./info-theme.js');

const { isaLangWith, langParser, getCount, exto } = require('riscv');

const ext = (rootRow, xlen, exto) => {

  const rec = (srcRow, dbRow) => {
    let verSpan = '';
    if (srcRow) {
      const {major, minor} = srcRow;
      if ((major !== undefined) || (minor !== undefined)) {
        verSpan = ['span', {class: 'version'}, 'v' + major + (minor ? ('.' + minor) : '')];
      }
    }

    if (srcRow && !dbRow) {
      const {name, kind} = srcRow;
      return ['div', {class: 'row'},
        ['span', {class: kind + 'ext'}, name, verSpan]
      ];
    }

    if (dbRow) {
      const {id, kind, items, desc, ver, url} = dbRow;
      const count = getCount(id, xlen);

      verSpan = verSpan || (ver ? ['span', {class: 'ver'}, 'v' + ver] : '');
      const spans = [
        ['span', {class: kind + 'ext'}, id],
        verSpan,
        count ? ['span', {class: 'count'}, count] : '',
        desc ? ['span', {class: 'desc'}, desc] : '',
        url ? ['a', {class: 'url', href: url}, '🔗'] : ''
      ];

      if (items) {
        return ['div', {class: 'group'}, ...spans, ...items.map(item => rec(undefined, item))];
      }
      return ['div', {class: 'row'}, ...spans];
    }
  };

  return [rec(rootRow, exto[rootRow.name.toLowerCase()])];
};

const isaBrief = (state, exto) => ['div',
  ['div', {class: 'row'}, 'XLEN = ' + state.xlen],
  ...state.body.flatMap((row) => {
    if (row.error) {
      return [['div', {class: 'row'},
        ['span', {class: 'error'}, row.error + ' at: ' + row.start]
      ]];
    }
    return ext(row, state.xlen, exto);
  })
];

const mountInfoRenderer = (div) => {
  const themeAllMod = new StyleModule(infoTheme);
  StyleModule.mount(document, themeAllMod);
  const render = renderer(div);
  const fn = (str) => {
    const parser = langParser(isaLangWith());
    const state = parser(str);
    const ml = isaBrief(state, exto);
    render(ml);
  };
  return fn;
};

module.exports = mountInfoRenderer;

/* eslint-env browser */
