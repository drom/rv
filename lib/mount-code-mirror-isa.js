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

const mountCodeMirrorISA = (isaDiv, infoRenderer, doc) => {
  const isaState = EditorState.create({
    doc,
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
