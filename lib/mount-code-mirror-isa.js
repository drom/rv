'use strict';

const {EditorState} = require('@codemirror/state');
const {EditorView, keymap} = require('@codemirror/view');
const {history, defaultKeymap, historyKeymap} = require('@codemirror/commands');

const extIsaTheme = require('./ext-isa-theme.js');
const extIsaLangWith = require('./ext-isa-lang-with.js');

const extRenderInfo = (infoRenderer) => {
  return EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      const str = update.state.doc.toString();
      infoRenderer(str);
    }
  });
};

const mountCodeMirrorISA = (isaDiv, infoRenderer) => {
  const isaState = EditorState.create({
    doc: 'rv64'
    // + 'i'
    // + 'mafdcv'
    + 'i2p1ma2p1f2p2d2p2c'
    // + 'g'
    // + '_v1'
    // + '_zicsr'
    + '_zifencei'
    // + '_zfh'
    // + '_zba'
    // + '_:3sd#'
    // + '_zbb'
    // + '_zvfh'
    + '_zk'
    + '_zvkn'
    + '_zvks'
    + '_Sv39'
    + '_zVe64f1'
    + '_sscofpmf0p1'
    // + '_zba1'
    // + '_zbb1'
    + '_xpa64q'
    // + '_xpb%$d8#'
    ,
    extensions: [
      history(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap
      ]),
      EditorView.lineWrapping,
      extIsaTheme,
      extIsaLangWith(),
      extRenderInfo(infoRenderer)
    ]
  });
  new EditorView({
    lineWrapping: true,
    state: isaState,
    parent: isaDiv
  });
  infoRenderer(isaState.doc.toString());
};

module.exports = mountCodeMirrorISA;

/* eslint-env browser */
