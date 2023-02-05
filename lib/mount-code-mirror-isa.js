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
    // doc: 'rv64imafdcv_zicsr_zifencei_zfh_zba_zbb_zvfh',
    // doc: 'rv64imac',
    doc: 'rv64i2p1ma2p1f2p2d2p2c_v1_zicsr_zifencei_sscofpmf0p1_zba1_zbb1_xpa_xpb1',
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
