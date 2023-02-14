'use strict';

const infoTheme = {
  '@font-face': {
    'font-family': 'Iosevka',
    src: 'url(./iosevka-term-light.woff2) format(woff2)'
  },
  body: {
    'font-family': "'IBM Plex Sans', sans-serif",
    // padding: '0px',
    // margin: '0px',
    // border: '0px',
    background: '#111',
    color: '#fff',
    /* font-size: 16px; */
    height: '100%'
  },
  '.error': {
    color: 'hsl(  0, 100%, 40%)'
  },
  '.row': {
    margin: '4px',
    padding: '4px',
    background: '#333'
  },
  '.bext': { 'font-weight': 'bold', margin: '4px', padding: '2px 6px', background: '#000', color: 'hsl(200, 90%, 50%)'},
  '.zext': { 'font-weight': 'bold', margin: '4px', padding: '2px 6px', background: '#000', color: 'hsl( 90, 90%, 50%)'},
  '.sext': { 'font-weight': 'bold', margin: '4px', padding: '2px 6px', background: '#000', color: 'hsl( 50, 90%, 50%)'},
  '.xext': { 'font-weight': 'bold', margin: '4px', padding: '2px 6px', background: '#000', color: 'hsl(280, 90%, 50%)'},
  '.version': {
    margin: '4px',
    padding: '2px 6px',
    background: '#000',
    color: '#eee'
  },
  '.ver': {
    margin: '4px',
    padding: '2px 6px',
    background: '#000',
    color: '#777'
  },
  '.group': {
    margin: '8px',
    padding: '2px',
    background: '#222'
  },
  '.group-head': {
    // margin: '8px',
    padding: '2px',
    // background: '#222'
  },
  '.count': {
    borderRadius: '16px',
    margin: '4px',
    padding: '2px 6px',
    background: '#555',
    color: '#ddd'
  },
  '.url': {
    borderRadius: '8px',
    margin: '2px',
    padding: '2px',
    background: '#000'
  }
};

module.exports = infoTheme;
