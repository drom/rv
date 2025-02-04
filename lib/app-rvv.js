'use strict';

// const pkg = require('../package.json');
const yaml = require('js-yaml');
// const mountCodeMirrorISA = require('./mount-code-mirror-isa.js');
// const mountInfoRenderer = require('./mount-info-renderer.js');
// const { exto } = require('riscv');

const indexOfUnifiedDb = require('./index-udb.json');
const rvvTraits = require('./rvv-traits.js');

const getInstsUdb = async () => {
  const { inst } = indexOfUnifiedDb;
  const res = [];
  const extKeys = Object.keys(inst);
  const proms = [];
  for (const extKey of extKeys) {
    const extVal = inst[extKey];
    const instKeys = Object.keys(extVal);
    for (const instKey of instKeys) {
      const instVal = extVal[instKey];
      const gitHubPath = 'https://raw.githubusercontent.com/riscv-software-src/riscv-unified-db/refs/heads/main/arch/' + instVal.$ref;
      proms.push(fetch(gitHubPath));
    }
  }
  const resps = await Promise.all(proms);
  for (const resp of resps) {
    const instBodyText = await resp.text();
    const instBody = yaml.load(instBodyText);
    // console.log(instBody);
    res.push(instBody);
  }
  return res;
};

const getSomeVal = (key, val) => (el) => {
  let elProp = el[key];
  if (elProp === val) {
    return true;
  }
  if (elProp.anyOf) {
    return elProp.anyOf.includes(val);
  }
  if (elProp.allOf) {
    return elProp.allOf.includes(val);
  }
};

const stain = (str, groups) => {
  const res = [];
  let pos = 0;
  Object.entries(groups).map(([key, val]) => {
    if (val) {
      const idx = str.indexOf(val);
      if (idx > pos) {
        res.push(str.slice(pos, idx));
      }
      pos = idx + val.length;
      res.push(`<span class="stain${key}">`, str.slice(idx, pos), '</span>');
    }
  });
  res.push(str.slice(pos, pos + str.length));
  return res.join('');
};


const mountInstPage = (main, inst, tr) => {
  return () => {
    console.log(inst);

    const res = [`<h1>${inst.name}</h1>`];

    tr.map(key => {
      const trait = rvvTraits.find(e => e.ch === key);
      const { groups } = inst.name.match(trait.m);
      console.log(groups);

      res.push('<div>');
      if (groups) {
        res.push('<div class="hier">', stain(inst.name, groups), '</div>');
      }
      res.push(`<img src="assets/${key}.png" alt="${key} ${trait.desc}"></img>`);
      res.push('</div>');
    });

    main.innerHTML = res.join('');
  };
};

const getTr = (inst) =>
  rvvTraits.flatMap(({ch, m}) => {
    const m1 = inst.name.match(m);
    return m1 ? [ch] : [];
  });


window.RVV = async () => {
  const sidenav = document.getElementById('sidenav');
  const main = document.getElementById('main');
  const insts = await getInstsUdb();
  const vecInsts = insts.filter(getSomeVal('definedBy', 'V')); // filter vector instructions

  const initialInst = vecInsts.find(e => e.name === 'vaadd.vv');
  mountInstPage(main, initialInst, getTr(initialInst))();

  vecInsts.map(inst => {
    const idiv = document.createElement('a');

    const tr = getTr(inst);

    idiv.innerHTML = `<span>${inst.name}</span>${tr.length ? `<span class="count">${tr.length}</span>`: ''}`;

    idiv.onclick = mountInstPage(main, inst, tr);
    sidenav.append(idiv);
  });

};

/* eslint-env browser */
