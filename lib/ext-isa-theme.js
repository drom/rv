'use strict';

const {EditorView} = require('@codemirror/view');

// https://codemirror.net/examples/styling/

const isaStylo = {
  '&': {
    color: '#fff',
    backgroundColor: '#222',
    padding: '4px',
    border: '1px solid #570;',
    borderRadius: '16px'
  },
  '.cm-content': {
    caretColor: '#3ff',
    fontFamily: 'Iosevka',
    lineHeight: 1.5,
    fontSize: '24px',
    width: '100%'
  }
};

const extIsaTheme = EditorView.theme(isaStylo, {dark: true});

module.exports = extIsaTheme;
