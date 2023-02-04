'use strict';

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
  mountCodeMirrorISA(isaDiv, infoRenderer);
};

/* eslint-env browser */
