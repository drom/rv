'use strict';

const pkg = require('../package.json');
const getElement = require('./get-element.js');
const mountCodeMirrorISA = require('./mount-code-mirror-isa.js');
const mountInfoRenderer = require('./mount-info-renderer.js');

window.RV = (contentDiv) => {
  const content = getElement(contentDiv);

  const isaDiv = document.createElement('div');
  content.append(isaDiv);

  const infoDiv = document.createElement('div');
  content.append(infoDiv);

  const infoRenderer = mountInfoRenderer(infoDiv);

  let doc =
  // 'rvi20u32'
  // 'rvi20u64'
  // 'rva20u64'
  'rv64'
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
  ;

  let urlSearch = window.location.search;
  if (urlSearch !== '') {
    doc = urlSearch.slice(1); // chop off '?'
  }
  mountCodeMirrorISA(isaDiv, infoRenderer, doc);

  document.getElementById('timestamp').innerHTML = pkg.timestamp;

};

/* eslint-env browser */
