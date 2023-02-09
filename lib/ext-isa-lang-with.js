'use strict';

const {StreamLanguage, syntaxHighlighting, HighlightStyle} = require('@codemirror/language');
const {tags} = require('@lezer/highlight');
const isaLangWith = require('riscv/lib/isa-lang-with.js');

const isaHighlightStyleGen = t => [
  {tag: [t.comment],        color: 'hsl(0,     0%, 30%)'},

  {tag: [t.namespace],      color: 'hsl(0,     0%, 90%)'},
  {tag: [t.className],      color: 'hsl(0,     0%, 90%)'},

  {tag: [t.punctuation],    color: 'hsl(56,    0%, 50%)'},
  {tag: [t.number],         color: 'hsl(56,    0%, 70%)'},

  {tag: [t.typeName],       color: 'hsl(220, 100%, 70%)'}, // base
  {tag: [t.macroName],      color: 'hsl(140, 100%, 70%)'}, // z
  {tag: [t.propertyName],   color: 'hsl( 70, 100%, 70%)'}, // s
  {tag: [t.labelName],      color: 'hsl(270, 100%, 70%)'}, // x

  {tag: [t.invalid],        color: 'hsl(  0, 100%, 40%)'}
];

const extIsaLangWith = () => {
  return [
    StreamLanguage.define(isaLangWith()),
    syntaxHighlighting(HighlightStyle.define(isaHighlightStyleGen(tags)))
  ];
};

module.exports = extIsaLangWith;
