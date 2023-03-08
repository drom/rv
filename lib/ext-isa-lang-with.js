'use strict';

const { StreamLanguage, syntaxHighlighting, HighlightStyle } = require('@codemirror/language');
const { tags } = require('@lezer/highlight');
const { isaLangWith } = require('riscv');

const isaHighlightStyleGen = t => [
  {tag: [t.comment],        color: 'hsl(0,     0%, 30%)'},

  {tag: [t.namespace],      color: 'hsl(0,     0%, 90%)'},
  {tag: [t.className],      color: 'hsl(0,     0%, 90%)'},

  {tag: [t.punctuation],    color: 'hsl(56,    0%, 50%)'},
  {tag: [t.number],         color: 'hsl(56,    0%, 70%)'},

  {tag: [t.typeName],       color: 'hsl(200, 90%, 50%)'}, // base
  {tag: [t.macroName],      color: 'hsl(90,  90%, 50%)'}, // z
  {tag: [t.propertyName],   color: 'hsl(50,  90%, 50%)'}, // s
  {tag: [t.labelName],      color: 'hsl(280, 90%, 50%)'}, // x

  {tag: [t.invalid],        color: 'hsl(  0, 100%, 40%)'}
];

const extIsaLangWith = () => {
  return [
    StreamLanguage.define(isaLangWith()),
    syntaxHighlighting(HighlightStyle.define(isaHighlightStyleGen(tags)))
  ];
};

module.exports = extIsaLangWith;
