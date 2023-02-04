'use strict';

const {EditorState} = require('@codemirror/state');
const {EditorView} = require('@codemirror/view');

const extIsaTheme = require('./ext-isa-theme.js');

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
    doc: 'rv64imac',
    extensions: [
      EditorView.lineWrapping,
      extIsaTheme,
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
