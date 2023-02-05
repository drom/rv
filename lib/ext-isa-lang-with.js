'use strict';

const {StreamLanguage, syntaxHighlighting, HighlightStyle} = require('@codemirror/language');
const {tags} = require('@lezer/highlight');

const isaLang = () => ({
  startState: function() {
    return {
      state: 0
    };
  },
  token: function (stream, stt) {
    switch(stt.state) {
    case 0: {
      const m = stream.match(/^[rR][vV]/); if (m) {
        stt.state = 1; return 'namespace';
      }
      break;
    }
    case 1: {
      const m = stream.match(/^(32|64|128)/); if (m) {
        stt.state = 2; return 'className';
      }
      break;
    }
    case 2:
      { const m = stream.match(/^_/); if (m) { return 'comment'; } }
      { const m = stream.match(/^z[a-zA-Z]+/); if (m) { stt.state = 3; return 'macroName'; } }
      { const m = stream.match(/^s[a-zA-Z]+/); if (m) { stt.state = 3; return 'propertyName'; } }
      { const m = stream.match(/^x[a-zA-Z]+/); if (m) { stt.state = 3; return 'labelName'; } }
      { const m = stream.match(/^[a-zA-Z]+/); if (m) { stt.state = 3; return 'typeName'; } }
      stream.skipToEnd();
      return 'comment';
    case 3:
      { const m = stream.match(/^\d+/); if (m) { stt.state = 4; return 'number'; } }
      stt.state = 2;
      break;
    case 4:
      { const m = stream.match(/^[pP]/); if (m) { stt.state = 5; return 'punctuation'; } }
      stt.state = 2;
      return 'comment';
    case 5:
      { const m = stream.match(/^\d+/); if (m) { stt.state = 2; return 'number'; } }
      stt.state = 2;
      return 'comment';
    default: {
      const m = stream.match(/^\w/);
      if (m) {
        return 'comment';
      }
    }
    }
    return 'comment';
  }
});

const isaHighlightStyleGen = t => [
  {tag: [t.comment],        color: 'hsl(0,     0%, 30%)'},

  {tag: [t.namespace],      color: 'hsl(100, 100%, 90%)'},
  {tag: [t.className],      color: 'hsl(100, 100%, 90%)', fontWeight: 'bold'},

  {tag: [t.punctuation],    color: 'hsl(56,    0%, 50%)'},
  {tag: [t.number],         color: 'hsl(56,    0%, 70%)'},

  {tag: [t.typeName],       color: 'hsl(210, 100%, 70%)'},
  {tag: [t.macroName],      color: 'hsl(150, 100%, 70%)'}, // z
  {tag: [t.propertyName],   color: 'hsl( 70, 100%, 70%)'}, // s
  {tag: [t.labelName],      color: 'hsl(  0, 100%, 70%)'}, // x
];

const extIsaLangWith = () => {
  return [
    StreamLanguage.define(isaLang()),
    syntaxHighlighting(HighlightStyle.define(isaHighlightStyleGen(tags)))
  ];
};

module.exports = extIsaLangWith;
