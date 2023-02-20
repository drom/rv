'use strict';

const {keymap} = require('@codemirror/view');

const run = (eView) => {
  const str = eView.viewState.state.doc.toString();
  window.location.search = '?' + str;
};

const extUpdateUrlWith = (key) => [
  keymap.of([{key, run, preventDefault: true}])
];

module.exports = extUpdateUrlWith;

/* eslint-env browser */
