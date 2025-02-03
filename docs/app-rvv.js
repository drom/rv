(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
      const m = str.match(val);
      console.log(m);
      res.push(str.slice(pos, m.index));
      pos = m.index + val.length;
      res.push(`<span class="stain${key}">`, str.slice(m.index, pos), '</span>');
    }
  });
  res.push(str.slice(pos, pos + str.length));
  return res.join('');
};

window.RVV = async () => {
  const sidenav = document.getElementById('sidenav');
  const main = document.getElementById('main');
  const insts = await getInstsUdb();
  const vecInsts = insts.filter(getSomeVal('definedBy', 'V')); // filter vector instructions

  vecInsts.map(inst => {
    const idiv = document.createElement('a');

    const tr = rvvTraits.flatMap(({ch, m}) => {
      const m1 = inst.name.match(m);
      return m1 ? [ch] : [];
    });

    idiv.innerHTML = `<span>${inst.name}</span>${tr.length ? `<span class="count">${tr.length}</span>`: ''}`;

    idiv.onclick = () => {
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
    sidenav.append(idiv);
  });

};

/* eslint-env browser */

},{"./index-udb.json":2,"./rvv-traits.js":3,"js-yaml":4}],2:[function(require,module,exports){
module.exports={
  "certificate_class": {
    "MC": {
      "$ref": "certificate_class/MC.yaml"
    },
    "MockCertificateClass": {
      "$ref": "certificate_class/MockCertificateClass.yaml"
    }
  },
  "certificate_model": {
    "MC100-32": {
      "$ref": "certificate_model/MC100-32.yaml"
    },
    "MC100-64": {
      "$ref": "certificate_model/MC100-64.yaml"
    },
    "MC200-32": {
      "$ref": "certificate_model/MC200-32.yaml"
    },
    "MC200-64": {
      "$ref": "certificate_model/MC200-64.yaml"
    },
    "MC300-32": {
      "$ref": "certificate_model/MC300-32.yaml"
    },
    "MC300-64": {
      "$ref": "certificate_model/MC300-64.yaml"
    },
    "MockCertificateModel": {
      "$ref": "certificate_model/MockCertificateModel.yaml"
    }
  },
  "csr": {
    "F": {
      "fcsr": {
        "$ref": "csr/F/fcsr.yaml"
      }
    },
    "H": {
      "hcounteren": {
        "$ref": "csr/H/hcounteren.yaml"
      },
      "henvcfg": {
        "$ref": "csr/H/henvcfg.yaml"
      },
      "henvcfgh": {
        "$ref": "csr/H/henvcfgh.yaml"
      },
      "hgatp": {
        "$ref": "csr/H/hgatp.yaml"
      },
      "htimedelta": {
        "$ref": "csr/H/htimedelta.yaml"
      },
      "htimedeltah": {
        "$ref": "csr/H/htimedeltah.yaml"
      },
      "htinst": {
        "$ref": "csr/H/htinst.yaml"
      },
      "htval": {
        "$ref": "csr/H/htval.yaml"
      },
      "mtinst": {
        "$ref": "csr/H/mtinst.yaml"
      },
      "mtval2": {
        "$ref": "csr/H/mtval2.yaml"
      },
      "vsatp": {
        "$ref": "csr/H/vsatp.yaml"
      }
    },
    "I": {
      "mcounteren": {
        "$ref": "csr/I/mcounteren.yaml"
      },
      "pmpaddr0": {
        "$ref": "csr/I/pmpaddr0.yaml"
      },
      "pmpaddr1": {
        "$ref": "csr/I/pmpaddr1.yaml"
      },
      "pmpaddr10": {
        "$ref": "csr/I/pmpaddr10.yaml"
      },
      "pmpaddr11": {
        "$ref": "csr/I/pmpaddr11.yaml"
      },
      "pmpaddr12": {
        "$ref": "csr/I/pmpaddr12.yaml"
      },
      "pmpaddr13": {
        "$ref": "csr/I/pmpaddr13.yaml"
      },
      "pmpaddr14": {
        "$ref": "csr/I/pmpaddr14.yaml"
      },
      "pmpaddr15": {
        "$ref": "csr/I/pmpaddr15.yaml"
      },
      "pmpaddr16": {
        "$ref": "csr/I/pmpaddr16.yaml"
      },
      "pmpaddr17": {
        "$ref": "csr/I/pmpaddr17.yaml"
      },
      "pmpaddr18": {
        "$ref": "csr/I/pmpaddr18.yaml"
      },
      "pmpaddr19": {
        "$ref": "csr/I/pmpaddr19.yaml"
      },
      "pmpaddr2": {
        "$ref": "csr/I/pmpaddr2.yaml"
      },
      "pmpaddr20": {
        "$ref": "csr/I/pmpaddr20.yaml"
      },
      "pmpaddr21": {
        "$ref": "csr/I/pmpaddr21.yaml"
      },
      "pmpaddr22": {
        "$ref": "csr/I/pmpaddr22.yaml"
      },
      "pmpaddr23": {
        "$ref": "csr/I/pmpaddr23.yaml"
      },
      "pmpaddr24": {
        "$ref": "csr/I/pmpaddr24.yaml"
      },
      "pmpaddr25": {
        "$ref": "csr/I/pmpaddr25.yaml"
      },
      "pmpaddr26": {
        "$ref": "csr/I/pmpaddr26.yaml"
      },
      "pmpaddr27": {
        "$ref": "csr/I/pmpaddr27.yaml"
      },
      "pmpaddr28": {
        "$ref": "csr/I/pmpaddr28.yaml"
      },
      "pmpaddr29": {
        "$ref": "csr/I/pmpaddr29.yaml"
      },
      "pmpaddr3": {
        "$ref": "csr/I/pmpaddr3.yaml"
      },
      "pmpaddr30": {
        "$ref": "csr/I/pmpaddr30.yaml"
      },
      "pmpaddr31": {
        "$ref": "csr/I/pmpaddr31.yaml"
      },
      "pmpaddr32": {
        "$ref": "csr/I/pmpaddr32.yaml"
      },
      "pmpaddr33": {
        "$ref": "csr/I/pmpaddr33.yaml"
      },
      "pmpaddr34": {
        "$ref": "csr/I/pmpaddr34.yaml"
      },
      "pmpaddr35": {
        "$ref": "csr/I/pmpaddr35.yaml"
      },
      "pmpaddr36": {
        "$ref": "csr/I/pmpaddr36.yaml"
      },
      "pmpaddr37": {
        "$ref": "csr/I/pmpaddr37.yaml"
      },
      "pmpaddr38": {
        "$ref": "csr/I/pmpaddr38.yaml"
      },
      "pmpaddr39": {
        "$ref": "csr/I/pmpaddr39.yaml"
      },
      "pmpaddr4": {
        "$ref": "csr/I/pmpaddr4.yaml"
      },
      "pmpaddr40": {
        "$ref": "csr/I/pmpaddr40.yaml"
      },
      "pmpaddr41": {
        "$ref": "csr/I/pmpaddr41.yaml"
      },
      "pmpaddr42": {
        "$ref": "csr/I/pmpaddr42.yaml"
      },
      "pmpaddr43": {
        "$ref": "csr/I/pmpaddr43.yaml"
      },
      "pmpaddr44": {
        "$ref": "csr/I/pmpaddr44.yaml"
      },
      "pmpaddr45": {
        "$ref": "csr/I/pmpaddr45.yaml"
      },
      "pmpaddr46": {
        "$ref": "csr/I/pmpaddr46.yaml"
      },
      "pmpaddr47": {
        "$ref": "csr/I/pmpaddr47.yaml"
      },
      "pmpaddr48": {
        "$ref": "csr/I/pmpaddr48.yaml"
      },
      "pmpaddr49": {
        "$ref": "csr/I/pmpaddr49.yaml"
      },
      "pmpaddr5": {
        "$ref": "csr/I/pmpaddr5.yaml"
      },
      "pmpaddr50": {
        "$ref": "csr/I/pmpaddr50.yaml"
      },
      "pmpaddr51": {
        "$ref": "csr/I/pmpaddr51.yaml"
      },
      "pmpaddr52": {
        "$ref": "csr/I/pmpaddr52.yaml"
      },
      "pmpaddr53": {
        "$ref": "csr/I/pmpaddr53.yaml"
      },
      "pmpaddr54": {
        "$ref": "csr/I/pmpaddr54.yaml"
      },
      "pmpaddr55": {
        "$ref": "csr/I/pmpaddr55.yaml"
      },
      "pmpaddr56": {
        "$ref": "csr/I/pmpaddr56.yaml"
      },
      "pmpaddr57": {
        "$ref": "csr/I/pmpaddr57.yaml"
      },
      "pmpaddr58": {
        "$ref": "csr/I/pmpaddr58.yaml"
      },
      "pmpaddr59": {
        "$ref": "csr/I/pmpaddr59.yaml"
      },
      "pmpaddr6": {
        "$ref": "csr/I/pmpaddr6.yaml"
      },
      "pmpaddr60": {
        "$ref": "csr/I/pmpaddr60.yaml"
      },
      "pmpaddr61": {
        "$ref": "csr/I/pmpaddr61.yaml"
      },
      "pmpaddr62": {
        "$ref": "csr/I/pmpaddr62.yaml"
      },
      "pmpaddr63": {
        "$ref": "csr/I/pmpaddr63.yaml"
      },
      "pmpaddr7": {
        "$ref": "csr/I/pmpaddr7.yaml"
      },
      "pmpaddr8": {
        "$ref": "csr/I/pmpaddr8.yaml"
      },
      "pmpaddr9": {
        "$ref": "csr/I/pmpaddr9.yaml"
      },
      "pmpcfg0": {
        "$ref": "csr/I/pmpcfg0.yaml"
      },
      "pmpcfg1": {
        "$ref": "csr/I/pmpcfg1.yaml"
      },
      "pmpcfg10": {
        "$ref": "csr/I/pmpcfg10.yaml"
      },
      "pmpcfg11": {
        "$ref": "csr/I/pmpcfg11.yaml"
      },
      "pmpcfg12": {
        "$ref": "csr/I/pmpcfg12.yaml"
      },
      "pmpcfg13": {
        "$ref": "csr/I/pmpcfg13.yaml"
      },
      "pmpcfg14": {
        "$ref": "csr/I/pmpcfg14.yaml"
      },
      "pmpcfg15": {
        "$ref": "csr/I/pmpcfg15.yaml"
      },
      "pmpcfg2": {
        "$ref": "csr/I/pmpcfg2.yaml"
      },
      "pmpcfg3": {
        "$ref": "csr/I/pmpcfg3.yaml"
      },
      "pmpcfg4": {
        "$ref": "csr/I/pmpcfg4.yaml"
      },
      "pmpcfg5": {
        "$ref": "csr/I/pmpcfg5.yaml"
      },
      "pmpcfg6": {
        "$ref": "csr/I/pmpcfg6.yaml"
      },
      "pmpcfg7": {
        "$ref": "csr/I/pmpcfg7.yaml"
      },
      "pmpcfg8": {
        "$ref": "csr/I/pmpcfg8.yaml"
      },
      "pmpcfg9": {
        "$ref": "csr/I/pmpcfg9.yaml"
      }
    },
    "S": {
      "scounteren": {
        "$ref": "csr/S/scounteren.yaml"
      }
    },
    "Smrnmi": {
      "mncause": {
        "$ref": "csr/Smrnmi/mncause.yaml"
      }
    },
    "Zicntr": {
      "mcountinhibit": {
        "$ref": "csr/Zicntr/mcountinhibit.yaml"
      }
    },
    "Zihpm": {
      "hpmcounter10": {
        "$ref": "csr/Zihpm/hpmcounter10.yaml"
      },
      "hpmcounter10h": {
        "$ref": "csr/Zihpm/hpmcounter10h.yaml"
      },
      "hpmcounter11": {
        "$ref": "csr/Zihpm/hpmcounter11.yaml"
      },
      "hpmcounter11h": {
        "$ref": "csr/Zihpm/hpmcounter11h.yaml"
      },
      "hpmcounter12": {
        "$ref": "csr/Zihpm/hpmcounter12.yaml"
      },
      "hpmcounter12h": {
        "$ref": "csr/Zihpm/hpmcounter12h.yaml"
      },
      "hpmcounter13": {
        "$ref": "csr/Zihpm/hpmcounter13.yaml"
      },
      "hpmcounter13h": {
        "$ref": "csr/Zihpm/hpmcounter13h.yaml"
      },
      "hpmcounter14": {
        "$ref": "csr/Zihpm/hpmcounter14.yaml"
      },
      "hpmcounter14h": {
        "$ref": "csr/Zihpm/hpmcounter14h.yaml"
      },
      "hpmcounter15": {
        "$ref": "csr/Zihpm/hpmcounter15.yaml"
      },
      "hpmcounter15h": {
        "$ref": "csr/Zihpm/hpmcounter15h.yaml"
      },
      "hpmcounter16": {
        "$ref": "csr/Zihpm/hpmcounter16.yaml"
      },
      "hpmcounter16h": {
        "$ref": "csr/Zihpm/hpmcounter16h.yaml"
      },
      "hpmcounter17": {
        "$ref": "csr/Zihpm/hpmcounter17.yaml"
      },
      "hpmcounter17h": {
        "$ref": "csr/Zihpm/hpmcounter17h.yaml"
      },
      "hpmcounter18": {
        "$ref": "csr/Zihpm/hpmcounter18.yaml"
      },
      "hpmcounter18h": {
        "$ref": "csr/Zihpm/hpmcounter18h.yaml"
      },
      "hpmcounter19": {
        "$ref": "csr/Zihpm/hpmcounter19.yaml"
      },
      "hpmcounter19h": {
        "$ref": "csr/Zihpm/hpmcounter19h.yaml"
      },
      "hpmcounter20": {
        "$ref": "csr/Zihpm/hpmcounter20.yaml"
      },
      "hpmcounter20h": {
        "$ref": "csr/Zihpm/hpmcounter20h.yaml"
      },
      "hpmcounter21": {
        "$ref": "csr/Zihpm/hpmcounter21.yaml"
      },
      "hpmcounter21h": {
        "$ref": "csr/Zihpm/hpmcounter21h.yaml"
      },
      "hpmcounter22": {
        "$ref": "csr/Zihpm/hpmcounter22.yaml"
      },
      "hpmcounter22h": {
        "$ref": "csr/Zihpm/hpmcounter22h.yaml"
      },
      "hpmcounter23": {
        "$ref": "csr/Zihpm/hpmcounter23.yaml"
      },
      "hpmcounter23h": {
        "$ref": "csr/Zihpm/hpmcounter23h.yaml"
      },
      "hpmcounter24": {
        "$ref": "csr/Zihpm/hpmcounter24.yaml"
      },
      "hpmcounter24h": {
        "$ref": "csr/Zihpm/hpmcounter24h.yaml"
      },
      "hpmcounter25": {
        "$ref": "csr/Zihpm/hpmcounter25.yaml"
      },
      "hpmcounter25h": {
        "$ref": "csr/Zihpm/hpmcounter25h.yaml"
      },
      "hpmcounter26": {
        "$ref": "csr/Zihpm/hpmcounter26.yaml"
      },
      "hpmcounter26h": {
        "$ref": "csr/Zihpm/hpmcounter26h.yaml"
      },
      "hpmcounter27": {
        "$ref": "csr/Zihpm/hpmcounter27.yaml"
      },
      "hpmcounter27h": {
        "$ref": "csr/Zihpm/hpmcounter27h.yaml"
      },
      "hpmcounter28": {
        "$ref": "csr/Zihpm/hpmcounter28.yaml"
      },
      "hpmcounter28h": {
        "$ref": "csr/Zihpm/hpmcounter28h.yaml"
      },
      "hpmcounter29": {
        "$ref": "csr/Zihpm/hpmcounter29.yaml"
      },
      "hpmcounter29h": {
        "$ref": "csr/Zihpm/hpmcounter29h.yaml"
      },
      "hpmcounter3": {
        "$ref": "csr/Zihpm/hpmcounter3.yaml"
      },
      "hpmcounter30": {
        "$ref": "csr/Zihpm/hpmcounter30.yaml"
      },
      "hpmcounter30h": {
        "$ref": "csr/Zihpm/hpmcounter30h.yaml"
      },
      "hpmcounter31": {
        "$ref": "csr/Zihpm/hpmcounter31.yaml"
      },
      "hpmcounter31h": {
        "$ref": "csr/Zihpm/hpmcounter31h.yaml"
      },
      "hpmcounter3h": {
        "$ref": "csr/Zihpm/hpmcounter3h.yaml"
      },
      "hpmcounter4": {
        "$ref": "csr/Zihpm/hpmcounter4.yaml"
      },
      "hpmcounter4h": {
        "$ref": "csr/Zihpm/hpmcounter4h.yaml"
      },
      "hpmcounter5": {
        "$ref": "csr/Zihpm/hpmcounter5.yaml"
      },
      "hpmcounter5h": {
        "$ref": "csr/Zihpm/hpmcounter5h.yaml"
      },
      "hpmcounter6": {
        "$ref": "csr/Zihpm/hpmcounter6.yaml"
      },
      "hpmcounter6h": {
        "$ref": "csr/Zihpm/hpmcounter6h.yaml"
      },
      "hpmcounter7": {
        "$ref": "csr/Zihpm/hpmcounter7.yaml"
      },
      "hpmcounter7h": {
        "$ref": "csr/Zihpm/hpmcounter7h.yaml"
      },
      "hpmcounter8": {
        "$ref": "csr/Zihpm/hpmcounter8.yaml"
      },
      "hpmcounter8h": {
        "$ref": "csr/Zihpm/hpmcounter8h.yaml"
      },
      "hpmcounter9": {
        "$ref": "csr/Zihpm/hpmcounter9.yaml"
      },
      "hpmcounter9h": {
        "$ref": "csr/Zihpm/hpmcounter9h.yaml"
      },
      "mhpmcounter10": {
        "$ref": "csr/Zihpm/mhpmcounter10.yaml"
      },
      "mhpmcounter10h": {
        "$ref": "csr/Zihpm/mhpmcounter10h.yaml"
      },
      "mhpmcounter11": {
        "$ref": "csr/Zihpm/mhpmcounter11.yaml"
      },
      "mhpmcounter11h": {
        "$ref": "csr/Zihpm/mhpmcounter11h.yaml"
      },
      "mhpmcounter12": {
        "$ref": "csr/Zihpm/mhpmcounter12.yaml"
      },
      "mhpmcounter12h": {
        "$ref": "csr/Zihpm/mhpmcounter12h.yaml"
      },
      "mhpmcounter13": {
        "$ref": "csr/Zihpm/mhpmcounter13.yaml"
      },
      "mhpmcounter13h": {
        "$ref": "csr/Zihpm/mhpmcounter13h.yaml"
      },
      "mhpmcounter14": {
        "$ref": "csr/Zihpm/mhpmcounter14.yaml"
      },
      "mhpmcounter14h": {
        "$ref": "csr/Zihpm/mhpmcounter14h.yaml"
      },
      "mhpmcounter15": {
        "$ref": "csr/Zihpm/mhpmcounter15.yaml"
      },
      "mhpmcounter15h": {
        "$ref": "csr/Zihpm/mhpmcounter15h.yaml"
      },
      "mhpmcounter16": {
        "$ref": "csr/Zihpm/mhpmcounter16.yaml"
      },
      "mhpmcounter16h": {
        "$ref": "csr/Zihpm/mhpmcounter16h.yaml"
      },
      "mhpmcounter17": {
        "$ref": "csr/Zihpm/mhpmcounter17.yaml"
      },
      "mhpmcounter17h": {
        "$ref": "csr/Zihpm/mhpmcounter17h.yaml"
      },
      "mhpmcounter18": {
        "$ref": "csr/Zihpm/mhpmcounter18.yaml"
      },
      "mhpmcounter18h": {
        "$ref": "csr/Zihpm/mhpmcounter18h.yaml"
      },
      "mhpmcounter19": {
        "$ref": "csr/Zihpm/mhpmcounter19.yaml"
      },
      "mhpmcounter19h": {
        "$ref": "csr/Zihpm/mhpmcounter19h.yaml"
      },
      "mhpmcounter20": {
        "$ref": "csr/Zihpm/mhpmcounter20.yaml"
      },
      "mhpmcounter20h": {
        "$ref": "csr/Zihpm/mhpmcounter20h.yaml"
      },
      "mhpmcounter21": {
        "$ref": "csr/Zihpm/mhpmcounter21.yaml"
      },
      "mhpmcounter21h": {
        "$ref": "csr/Zihpm/mhpmcounter21h.yaml"
      },
      "mhpmcounter22": {
        "$ref": "csr/Zihpm/mhpmcounter22.yaml"
      },
      "mhpmcounter22h": {
        "$ref": "csr/Zihpm/mhpmcounter22h.yaml"
      },
      "mhpmcounter23": {
        "$ref": "csr/Zihpm/mhpmcounter23.yaml"
      },
      "mhpmcounter23h": {
        "$ref": "csr/Zihpm/mhpmcounter23h.yaml"
      },
      "mhpmcounter24": {
        "$ref": "csr/Zihpm/mhpmcounter24.yaml"
      },
      "mhpmcounter24h": {
        "$ref": "csr/Zihpm/mhpmcounter24h.yaml"
      },
      "mhpmcounter25": {
        "$ref": "csr/Zihpm/mhpmcounter25.yaml"
      },
      "mhpmcounter25h": {
        "$ref": "csr/Zihpm/mhpmcounter25h.yaml"
      },
      "mhpmcounter26": {
        "$ref": "csr/Zihpm/mhpmcounter26.yaml"
      },
      "mhpmcounter26h": {
        "$ref": "csr/Zihpm/mhpmcounter26h.yaml"
      },
      "mhpmcounter27": {
        "$ref": "csr/Zihpm/mhpmcounter27.yaml"
      },
      "mhpmcounter27h": {
        "$ref": "csr/Zihpm/mhpmcounter27h.yaml"
      },
      "mhpmcounter28": {
        "$ref": "csr/Zihpm/mhpmcounter28.yaml"
      },
      "mhpmcounter28h": {
        "$ref": "csr/Zihpm/mhpmcounter28h.yaml"
      },
      "mhpmcounter29": {
        "$ref": "csr/Zihpm/mhpmcounter29.yaml"
      },
      "mhpmcounter29h": {
        "$ref": "csr/Zihpm/mhpmcounter29h.yaml"
      },
      "mhpmcounter3": {
        "$ref": "csr/Zihpm/mhpmcounter3.yaml"
      },
      "mhpmcounter30": {
        "$ref": "csr/Zihpm/mhpmcounter30.yaml"
      },
      "mhpmcounter30h": {
        "$ref": "csr/Zihpm/mhpmcounter30h.yaml"
      },
      "mhpmcounter31": {
        "$ref": "csr/Zihpm/mhpmcounter31.yaml"
      },
      "mhpmcounter31h": {
        "$ref": "csr/Zihpm/mhpmcounter31h.yaml"
      },
      "mhpmcounter3h": {
        "$ref": "csr/Zihpm/mhpmcounter3h.yaml"
      },
      "mhpmcounter4": {
        "$ref": "csr/Zihpm/mhpmcounter4.yaml"
      },
      "mhpmcounter4h": {
        "$ref": "csr/Zihpm/mhpmcounter4h.yaml"
      },
      "mhpmcounter5": {
        "$ref": "csr/Zihpm/mhpmcounter5.yaml"
      },
      "mhpmcounter5h": {
        "$ref": "csr/Zihpm/mhpmcounter5h.yaml"
      },
      "mhpmcounter6": {
        "$ref": "csr/Zihpm/mhpmcounter6.yaml"
      },
      "mhpmcounter6h": {
        "$ref": "csr/Zihpm/mhpmcounter6h.yaml"
      },
      "mhpmcounter7": {
        "$ref": "csr/Zihpm/mhpmcounter7.yaml"
      },
      "mhpmcounter7h": {
        "$ref": "csr/Zihpm/mhpmcounter7h.yaml"
      },
      "mhpmcounter8": {
        "$ref": "csr/Zihpm/mhpmcounter8.yaml"
      },
      "mhpmcounter8h": {
        "$ref": "csr/Zihpm/mhpmcounter8h.yaml"
      },
      "mhpmcounter9": {
        "$ref": "csr/Zihpm/mhpmcounter9.yaml"
      },
      "mhpmcounter9h": {
        "$ref": "csr/Zihpm/mhpmcounter9h.yaml"
      },
      "mhpmevent10": {
        "$ref": "csr/Zihpm/mhpmevent10.yaml"
      },
      "mhpmevent10h": {
        "$ref": "csr/Zihpm/mhpmevent10h.yaml"
      },
      "mhpmevent11": {
        "$ref": "csr/Zihpm/mhpmevent11.yaml"
      },
      "mhpmevent11h": {
        "$ref": "csr/Zihpm/mhpmevent11h.yaml"
      },
      "mhpmevent12": {
        "$ref": "csr/Zihpm/mhpmevent12.yaml"
      },
      "mhpmevent12h": {
        "$ref": "csr/Zihpm/mhpmevent12h.yaml"
      },
      "mhpmevent13": {
        "$ref": "csr/Zihpm/mhpmevent13.yaml"
      },
      "mhpmevent13h": {
        "$ref": "csr/Zihpm/mhpmevent13h.yaml"
      },
      "mhpmevent14": {
        "$ref": "csr/Zihpm/mhpmevent14.yaml"
      },
      "mhpmevent14h": {
        "$ref": "csr/Zihpm/mhpmevent14h.yaml"
      },
      "mhpmevent15": {
        "$ref": "csr/Zihpm/mhpmevent15.yaml"
      },
      "mhpmevent15h": {
        "$ref": "csr/Zihpm/mhpmevent15h.yaml"
      },
      "mhpmevent16": {
        "$ref": "csr/Zihpm/mhpmevent16.yaml"
      },
      "mhpmevent16h": {
        "$ref": "csr/Zihpm/mhpmevent16h.yaml"
      },
      "mhpmevent17": {
        "$ref": "csr/Zihpm/mhpmevent17.yaml"
      },
      "mhpmevent17h": {
        "$ref": "csr/Zihpm/mhpmevent17h.yaml"
      },
      "mhpmevent18": {
        "$ref": "csr/Zihpm/mhpmevent18.yaml"
      },
      "mhpmevent18h": {
        "$ref": "csr/Zihpm/mhpmevent18h.yaml"
      },
      "mhpmevent19": {
        "$ref": "csr/Zihpm/mhpmevent19.yaml"
      },
      "mhpmevent19h": {
        "$ref": "csr/Zihpm/mhpmevent19h.yaml"
      },
      "mhpmevent20": {
        "$ref": "csr/Zihpm/mhpmevent20.yaml"
      },
      "mhpmevent20h": {
        "$ref": "csr/Zihpm/mhpmevent20h.yaml"
      },
      "mhpmevent21": {
        "$ref": "csr/Zihpm/mhpmevent21.yaml"
      },
      "mhpmevent21h": {
        "$ref": "csr/Zihpm/mhpmevent21h.yaml"
      },
      "mhpmevent22": {
        "$ref": "csr/Zihpm/mhpmevent22.yaml"
      },
      "mhpmevent22h": {
        "$ref": "csr/Zihpm/mhpmevent22h.yaml"
      },
      "mhpmevent23": {
        "$ref": "csr/Zihpm/mhpmevent23.yaml"
      },
      "mhpmevent23h": {
        "$ref": "csr/Zihpm/mhpmevent23h.yaml"
      },
      "mhpmevent24": {
        "$ref": "csr/Zihpm/mhpmevent24.yaml"
      },
      "mhpmevent24h": {
        "$ref": "csr/Zihpm/mhpmevent24h.yaml"
      },
      "mhpmevent25": {
        "$ref": "csr/Zihpm/mhpmevent25.yaml"
      },
      "mhpmevent25h": {
        "$ref": "csr/Zihpm/mhpmevent25h.yaml"
      },
      "mhpmevent26": {
        "$ref": "csr/Zihpm/mhpmevent26.yaml"
      },
      "mhpmevent26h": {
        "$ref": "csr/Zihpm/mhpmevent26h.yaml"
      },
      "mhpmevent27": {
        "$ref": "csr/Zihpm/mhpmevent27.yaml"
      },
      "mhpmevent27h": {
        "$ref": "csr/Zihpm/mhpmevent27h.yaml"
      },
      "mhpmevent28": {
        "$ref": "csr/Zihpm/mhpmevent28.yaml"
      },
      "mhpmevent28h": {
        "$ref": "csr/Zihpm/mhpmevent28h.yaml"
      },
      "mhpmevent29": {
        "$ref": "csr/Zihpm/mhpmevent29.yaml"
      },
      "mhpmevent29h": {
        "$ref": "csr/Zihpm/mhpmevent29h.yaml"
      },
      "mhpmevent3": {
        "$ref": "csr/Zihpm/mhpmevent3.yaml"
      },
      "mhpmevent30": {
        "$ref": "csr/Zihpm/mhpmevent30.yaml"
      },
      "mhpmevent30h": {
        "$ref": "csr/Zihpm/mhpmevent30h.yaml"
      },
      "mhpmevent31": {
        "$ref": "csr/Zihpm/mhpmevent31.yaml"
      },
      "mhpmevent31h": {
        "$ref": "csr/Zihpm/mhpmevent31h.yaml"
      },
      "mhpmevent3h": {
        "$ref": "csr/Zihpm/mhpmevent3h.yaml"
      },
      "mhpmevent4": {
        "$ref": "csr/Zihpm/mhpmevent4.yaml"
      },
      "mhpmevent4h": {
        "$ref": "csr/Zihpm/mhpmevent4h.yaml"
      },
      "mhpmevent5": {
        "$ref": "csr/Zihpm/mhpmevent5.yaml"
      },
      "mhpmevent5h": {
        "$ref": "csr/Zihpm/mhpmevent5h.yaml"
      },
      "mhpmevent6": {
        "$ref": "csr/Zihpm/mhpmevent6.yaml"
      },
      "mhpmevent6h": {
        "$ref": "csr/Zihpm/mhpmevent6h.yaml"
      },
      "mhpmevent7": {
        "$ref": "csr/Zihpm/mhpmevent7.yaml"
      },
      "mhpmevent7h": {
        "$ref": "csr/Zihpm/mhpmevent7h.yaml"
      },
      "mhpmevent8": {
        "$ref": "csr/Zihpm/mhpmevent8.yaml"
      },
      "mhpmevent8h": {
        "$ref": "csr/Zihpm/mhpmevent8h.yaml"
      },
      "mhpmevent9": {
        "$ref": "csr/Zihpm/mhpmevent9.yaml"
      },
      "mhpmevent9h": {
        "$ref": "csr/Zihpm/mhpmevent9h.yaml"
      }
    },
    "cycle": {
      "$ref": "csr/cycle.yaml"
    },
    "cycleh": {
      "$ref": "csr/cycleh.yaml"
    },
    "hedeleg": {
      "$ref": "csr/hedeleg.yaml"
    },
    "hedelegh": {
      "$ref": "csr/hedelegh.yaml"
    },
    "hstatus": {
      "$ref": "csr/hstatus.yaml"
    },
    "instret": {
      "$ref": "csr/instret.yaml"
    },
    "instreth": {
      "$ref": "csr/instreth.yaml"
    },
    "marchid": {
      "$ref": "csr/marchid.yaml"
    },
    "mcause": {
      "$ref": "csr/mcause.yaml"
    },
    "mconfigptr": {
      "$ref": "csr/mconfigptr.yaml"
    },
    "mcycle": {
      "$ref": "csr/mcycle.yaml"
    },
    "mcycleh": {
      "$ref": "csr/mcycleh.yaml"
    },
    "medeleg": {
      "$ref": "csr/medeleg.yaml"
    },
    "medelegh": {
      "$ref": "csr/medelegh.yaml"
    },
    "menvcfg": {
      "$ref": "csr/menvcfg.yaml"
    },
    "menvcfgh": {
      "$ref": "csr/menvcfgh.yaml"
    },
    "mepc": {
      "$ref": "csr/mepc.yaml"
    },
    "mhartid": {
      "$ref": "csr/mhartid.yaml"
    },
    "mideleg": {
      "$ref": "csr/mideleg.yaml"
    },
    "mie": {
      "$ref": "csr/mie.yaml"
    },
    "mimpid": {
      "$ref": "csr/mimpid.yaml"
    },
    "minstret": {
      "$ref": "csr/minstret.yaml"
    },
    "minstreth": {
      "$ref": "csr/minstreth.yaml"
    },
    "mip": {
      "$ref": "csr/mip.yaml"
    },
    "misa": {
      "$ref": "csr/misa.yaml"
    },
    "mscratch": {
      "$ref": "csr/mscratch.yaml"
    },
    "mseccfg": {
      "$ref": "csr/mseccfg.yaml"
    },
    "mseccfgh": {
      "$ref": "csr/mseccfgh.yaml"
    },
    "mstatus": {
      "$ref": "csr/mstatus.yaml"
    },
    "mstatush": {
      "$ref": "csr/mstatush.yaml"
    },
    "mtval": {
      "$ref": "csr/mtval.yaml"
    },
    "mtvec": {
      "$ref": "csr/mtvec.yaml"
    },
    "mvendorid": {
      "$ref": "csr/mvendorid.yaml"
    },
    "satp": {
      "$ref": "csr/satp.yaml"
    },
    "scause": {
      "$ref": "csr/scause.yaml"
    },
    "senvcfg": {
      "$ref": "csr/senvcfg.yaml"
    },
    "sepc": {
      "$ref": "csr/sepc.yaml"
    },
    "sip": {
      "$ref": "csr/sip.yaml"
    },
    "sscratch": {
      "$ref": "csr/sscratch.yaml"
    },
    "sstatus": {
      "$ref": "csr/sstatus.yaml"
    },
    "stval": {
      "$ref": "csr/stval.yaml"
    },
    "stvec": {
      "$ref": "csr/stvec.yaml"
    },
    "time": {
      "$ref": "csr/time.yaml"
    },
    "timeh": {
      "$ref": "csr/timeh.yaml"
    },
    "vscause": {
      "$ref": "csr/vscause.yaml"
    },
    "vsepc": {
      "$ref": "csr/vsepc.yaml"
    },
    "vsstatus": {
      "$ref": "csr/vsstatus.yaml"
    },
    "vstval": {
      "$ref": "csr/vstval.yaml"
    },
    "vstvec": {
      "$ref": "csr/vstvec.yaml"
    }
  },
  "ext": {
    "A": {
      "$ref": "ext/A.yaml"
    },
    "B": {
      "$ref": "ext/B.yaml"
    },
    "C": {
      "$ref": "ext/C.yaml"
    },
    "D": {
      "$ref": "ext/D.yaml"
    },
    "F": {
      "$ref": "ext/F.yaml"
    },
    "H": {
      "$ref": "ext/H.yaml"
    },
    "I": {
      "$ref": "ext/I.yaml"
    },
    "M": {
      "$ref": "ext/M.yaml"
    },
    "Q": {
      "$ref": "ext/Q.yaml"
    },
    "S": {
      "$ref": "ext/S.yaml"
    },
    "Sdext": {
      "$ref": "ext/Sdext.yaml"
    },
    "Sdtrig": {
      "$ref": "ext/Sdtrig.yaml"
    },
    "Sha": {
      "$ref": "ext/Sha.yaml"
    },
    "Shgatpa": {
      "$ref": "ext/Shgatpa.yaml"
    },
    "Shtvala": {
      "$ref": "ext/Shtvala.yaml"
    },
    "Shvstvala": {
      "$ref": "ext/Shvstvala.yaml"
    },
    "Shvstvecd": {
      "$ref": "ext/Shvstvecd.yaml"
    },
    "Sm": {
      "$ref": "ext/Sm.yaml"
    },
    "Smaia": {
      "$ref": "ext/Smaia.yaml"
    },
    "Smcdeleg": {
      "$ref": "ext/Smcdeleg.yaml"
    },
    "Smcntrpmf": {
      "$ref": "ext/Smcntrpmf.yaml"
    },
    "Smdbltrp": {
      "$ref": "ext/Smdbltrp.yaml"
    },
    "Smhpm": {
      "$ref": "ext/Smhpm.yaml"
    },
    "Smmpm": {
      "$ref": "ext/Smmpm.yaml"
    },
    "Smnpm": {
      "$ref": "ext/Smnpm.yaml"
    },
    "Smpmp": {
      "$ref": "ext/Smpmp.yaml"
    },
    "Smrnmi": {
      "$ref": "ext/Smrnmi.yaml"
    },
    "Ssaia": {
      "$ref": "ext/Ssaia.yaml"
    },
    "Ssccfg": {
      "$ref": "ext/Ssccfg.yaml"
    },
    "Ssccptr": {
      "$ref": "ext/Ssccptr.yaml"
    },
    "Sscofpmf": {
      "$ref": "ext/Sscofpmf.yaml"
    },
    "Sscounterenw": {
      "$ref": "ext/Sscounterenw.yaml"
    },
    "Ssnpm": {
      "$ref": "ext/Ssnpm.yaml"
    },
    "Sspm": {
      "$ref": "ext/Sspm.yaml"
    },
    "Ssstateen": {
      "$ref": "ext/Ssstateen.yaml"
    },
    "Ssstrict": {
      "$ref": "ext/Ssstrict.yaml"
    },
    "Sstc": {
      "$ref": "ext/Sstc.yaml"
    },
    "Sstvala": {
      "$ref": "ext/Sstvala.yaml"
    },
    "Sstvecd": {
      "$ref": "ext/Sstvecd.yaml"
    },
    "Ssu64xl": {
      "$ref": "ext/Ssu64xl.yaml"
    },
    "Supm": {
      "$ref": "ext/Supm.yaml"
    },
    "Sv32": {
      "$ref": "ext/Sv32.yaml"
    },
    "Sv39": {
      "$ref": "ext/Sv39.yaml"
    },
    "Sv48": {
      "$ref": "ext/Sv48.yaml"
    },
    "Sv57": {
      "$ref": "ext/Sv57.yaml"
    },
    "Svade": {
      "$ref": "ext/Svade.yaml"
    },
    "Svadu": {
      "$ref": "ext/Svadu.yaml"
    },
    "Svbare": {
      "$ref": "ext/Svbare.yaml"
    },
    "Svinval": {
      "$ref": "ext/Svinval.yaml"
    },
    "Svnapot": {
      "$ref": "ext/Svnapot.yaml"
    },
    "Svpbmt": {
      "$ref": "ext/Svpbmt.yaml"
    },
    "Svvptc": {
      "$ref": "ext/Svvptc.yaml"
    },
    "U": {
      "$ref": "ext/U.yaml"
    },
    "V": {
      "$ref": "ext/V.yaml"
    },
    "Xmock": {
      "$ref": "ext/Xmock.yaml"
    },
    "Za128rs": {
      "$ref": "ext/Za128rs.yaml"
    },
    "Za64rs": {
      "$ref": "ext/Za64rs.yaml"
    },
    "Zaamo": {
      "$ref": "ext/Zaamo.yaml"
    },
    "Zabha": {
      "$ref": "ext/Zabha.yaml"
    },
    "Zacas": {
      "$ref": "ext/Zacas.yaml"
    },
    "Zalasr": {
      "$ref": "ext/Zalasr.yaml"
    },
    "Zalrsc": {
      "$ref": "ext/Zalrsc.yaml"
    },
    "Zama16b": {
      "$ref": "ext/Zama16b.yaml"
    },
    "Zawrs": {
      "$ref": "ext/Zawrs.yaml"
    },
    "Zba": {
      "$ref": "ext/Zba.yaml"
    },
    "Zbb": {
      "$ref": "ext/Zbb.yaml"
    },
    "Zbc": {
      "$ref": "ext/Zbc.yaml"
    },
    "Zbkb": {
      "$ref": "ext/Zbkb.yaml"
    },
    "Zbkc": {
      "$ref": "ext/Zbkc.yaml"
    },
    "Zbkx": {
      "$ref": "ext/Zbkx.yaml"
    },
    "Zbs": {
      "$ref": "ext/Zbs.yaml"
    },
    "Zca": {
      "$ref": "ext/Zca.yaml"
    },
    "Zcb": {
      "$ref": "ext/Zcb.yaml"
    },
    "Zcd": {
      "$ref": "ext/Zcd.yaml"
    },
    "Zce": {
      "$ref": "ext/Zce.yaml"
    },
    "Zcmop": {
      "$ref": "ext/Zcmop.yaml"
    },
    "Zcmp": {
      "$ref": "ext/Zcmp.yaml"
    },
    "Zcmt": {
      "$ref": "ext/Zcmt.yaml"
    },
    "Zfa": {
      "$ref": "ext/Zfa.yaml"
    },
    "Zfbfmin": {
      "$ref": "ext/Zfbfmin.yaml"
    },
    "Zfh": {
      "$ref": "ext/Zfh.yaml"
    },
    "Zfhmin": {
      "$ref": "ext/Zfhmin.yaml"
    },
    "Zhinx": {
      "$ref": "ext/Zhinx.yaml"
    },
    "Zic64b": {
      "$ref": "ext/Zic64b.yaml"
    },
    "Zicbom": {
      "$ref": "ext/Zicbom.yaml"
    },
    "Zicbop": {
      "$ref": "ext/Zicbop.yaml"
    },
    "Zicboz": {
      "$ref": "ext/Zicboz.yaml"
    },
    "Ziccamoa": {
      "$ref": "ext/Ziccamoa.yaml"
    },
    "Ziccamoc": {
      "$ref": "ext/Ziccamoc.yaml"
    },
    "Ziccif": {
      "$ref": "ext/Ziccif.yaml"
    },
    "Zicclsm": {
      "$ref": "ext/Zicclsm.yaml"
    },
    "Ziccrse": {
      "$ref": "ext/Ziccrse.yaml"
    },
    "Zicfilp": {
      "$ref": "ext/Zicfilp.yaml"
    },
    "Zicfiss": {
      "$ref": "ext/Zicfiss.yaml"
    },
    "Zicntr": {
      "$ref": "ext/Zicntr.yaml"
    },
    "Zicond": {
      "$ref": "ext/Zicond.yaml"
    },
    "Zicsr": {
      "$ref": "ext/Zicsr.yaml"
    },
    "Zifencei": {
      "$ref": "ext/Zifencei.yaml"
    },
    "Zihintntl": {
      "$ref": "ext/Zihintntl.yaml"
    },
    "Zihintpause": {
      "$ref": "ext/Zihintpause.yaml"
    },
    "Zihpm": {
      "$ref": "ext/Zihpm.yaml"
    },
    "Zimop": {
      "$ref": "ext/Zimop.yaml"
    },
    "Zk": {
      "$ref": "ext/Zk.yaml"
    },
    "Zkn": {
      "$ref": "ext/Zkn.yaml"
    },
    "Zknd": {
      "$ref": "ext/Zknd.yaml"
    },
    "Zkne": {
      "$ref": "ext/Zkne.yaml"
    },
    "Zknh": {
      "$ref": "ext/Zknh.yaml"
    },
    "Zkr": {
      "$ref": "ext/Zkr.yaml"
    },
    "Zks": {
      "$ref": "ext/Zks.yaml"
    },
    "Zksed": {
      "$ref": "ext/Zksed.yaml"
    },
    "Zksh": {
      "$ref": "ext/Zksh.yaml"
    },
    "Zkt": {
      "$ref": "ext/Zkt.yaml"
    },
    "Zmmul": {
      "$ref": "ext/Zmmul.yaml"
    },
    "Zvbb": {
      "$ref": "ext/Zvbb.yaml"
    },
    "Zvbc": {
      "$ref": "ext/Zvbc.yaml"
    },
    "Zvfbfmin": {
      "$ref": "ext/Zvfbfmin.yaml"
    },
    "Zvfbfwma": {
      "$ref": "ext/Zvfbfwma.yaml"
    },
    "Zvfh": {
      "$ref": "ext/Zvfh.yaml"
    },
    "Zvfhmin": {
      "$ref": "ext/Zvfhmin.yaml"
    },
    "Zvkb": {
      "$ref": "ext/Zvkb.yaml"
    },
    "Zvkg": {
      "$ref": "ext/Zvkg.yaml"
    },
    "Zvkn": {
      "$ref": "ext/Zvkn.yaml"
    },
    "Zvknc": {
      "$ref": "ext/Zvknc.yaml"
    },
    "Zvkned": {
      "$ref": "ext/Zvkned.yaml"
    },
    "Zvkng": {
      "$ref": "ext/Zvkng.yaml"
    },
    "Zvknha": {
      "$ref": "ext/Zvknha.yaml"
    },
    "Zvknhb": {
      "$ref": "ext/Zvknhb.yaml"
    },
    "Zvks": {
      "$ref": "ext/Zvks.yaml"
    },
    "Zvksc": {
      "$ref": "ext/Zvksc.yaml"
    },
    "Zvksed": {
      "$ref": "ext/Zvksed.yaml"
    },
    "Zvksg": {
      "$ref": "ext/Zvksg.yaml"
    },
    "Zvksh": {
      "$ref": "ext/Zvksh.yaml"
    },
    "Zvkt": {
      "$ref": "ext/Zvkt.yaml"
    }
  },
  "inst": {
    "A": {
      "amoadd.d": {
        "$ref": "inst/A/amoadd.d.yaml"
      },
      "amoadd.w": {
        "$ref": "inst/A/amoadd.w.yaml"
      },
      "amoand.d": {
        "$ref": "inst/A/amoand.d.yaml"
      },
      "amoand.w": {
        "$ref": "inst/A/amoand.w.yaml"
      },
      "amomax.d": {
        "$ref": "inst/A/amomax.d.yaml"
      },
      "amomax.w": {
        "$ref": "inst/A/amomax.w.yaml"
      },
      "amomaxu.d": {
        "$ref": "inst/A/amomaxu.d.yaml"
      },
      "amomaxu.w": {
        "$ref": "inst/A/amomaxu.w.yaml"
      },
      "amomin.d": {
        "$ref": "inst/A/amomin.d.yaml"
      },
      "amomin.w": {
        "$ref": "inst/A/amomin.w.yaml"
      },
      "amominu.d": {
        "$ref": "inst/A/amominu.d.yaml"
      },
      "amominu.w": {
        "$ref": "inst/A/amominu.w.yaml"
      },
      "amoor.d": {
        "$ref": "inst/A/amoor.d.yaml"
      },
      "amoor.w": {
        "$ref": "inst/A/amoor.w.yaml"
      },
      "amoswap.d": {
        "$ref": "inst/A/amoswap.d.yaml"
      },
      "amoswap.w": {
        "$ref": "inst/A/amoswap.w.yaml"
      },
      "amoxor.d": {
        "$ref": "inst/A/amoxor.d.yaml"
      },
      "amoxor.w": {
        "$ref": "inst/A/amoxor.w.yaml"
      },
      "lr.d": {
        "$ref": "inst/A/lr.d.yaml"
      },
      "lr.w": {
        "$ref": "inst/A/lr.w.yaml"
      },
      "sc.d": {
        "$ref": "inst/A/sc.d.yaml"
      },
      "sc.w": {
        "$ref": "inst/A/sc.w.yaml"
      }
    },
    "B": {
      "add.uw": {
        "$ref": "inst/B/add.uw.yaml"
      },
      "andn": {
        "$ref": "inst/B/andn.yaml"
      },
      "bclr": {
        "$ref": "inst/B/bclr.yaml"
      },
      "bclri": {
        "$ref": "inst/B/bclri.yaml"
      },
      "bext": {
        "$ref": "inst/B/bext.yaml"
      },
      "bexti": {
        "$ref": "inst/B/bexti.yaml"
      },
      "binv": {
        "$ref": "inst/B/binv.yaml"
      },
      "binvi": {
        "$ref": "inst/B/binvi.yaml"
      },
      "bset": {
        "$ref": "inst/B/bset.yaml"
      },
      "bseti": {
        "$ref": "inst/B/bseti.yaml"
      },
      "clmul": {
        "$ref": "inst/B/clmul.yaml"
      },
      "clmulh": {
        "$ref": "inst/B/clmulh.yaml"
      },
      "clmulr": {
        "$ref": "inst/B/clmulr.yaml"
      },
      "clz": {
        "$ref": "inst/B/clz.yaml"
      },
      "clzw": {
        "$ref": "inst/B/clzw.yaml"
      },
      "cpop": {
        "$ref": "inst/B/cpop.yaml"
      },
      "cpopw": {
        "$ref": "inst/B/cpopw.yaml"
      },
      "ctz": {
        "$ref": "inst/B/ctz.yaml"
      },
      "ctzw": {
        "$ref": "inst/B/ctzw.yaml"
      },
      "max": {
        "$ref": "inst/B/max.yaml"
      },
      "maxu": {
        "$ref": "inst/B/maxu.yaml"
      },
      "min": {
        "$ref": "inst/B/min.yaml"
      },
      "minu": {
        "$ref": "inst/B/minu.yaml"
      },
      "orc.b": {
        "$ref": "inst/B/orc.b.yaml"
      },
      "orn": {
        "$ref": "inst/B/orn.yaml"
      },
      "rev8": {
        "$ref": "inst/B/rev8.yaml"
      },
      "rol": {
        "$ref": "inst/B/rol.yaml"
      },
      "rolw": {
        "$ref": "inst/B/rolw.yaml"
      },
      "ror": {
        "$ref": "inst/B/ror.yaml"
      },
      "rori": {
        "$ref": "inst/B/rori.yaml"
      },
      "roriw": {
        "$ref": "inst/B/roriw.yaml"
      },
      "rorw": {
        "$ref": "inst/B/rorw.yaml"
      },
      "sext.b": {
        "$ref": "inst/B/sext.b.yaml"
      },
      "sext.h": {
        "$ref": "inst/B/sext.h.yaml"
      },
      "sh1add.uw": {
        "$ref": "inst/B/sh1add.uw.yaml"
      },
      "sh1add": {
        "$ref": "inst/B/sh1add.yaml"
      },
      "sh2add.uw": {
        "$ref": "inst/B/sh2add.uw.yaml"
      },
      "sh2add": {
        "$ref": "inst/B/sh2add.yaml"
      },
      "sh3add.uw": {
        "$ref": "inst/B/sh3add.uw.yaml"
      },
      "sh3add": {
        "$ref": "inst/B/sh3add.yaml"
      },
      "slli.uw": {
        "$ref": "inst/B/slli.uw.yaml"
      },
      "xnor": {
        "$ref": "inst/B/xnor.yaml"
      },
      "zext.h": {
        "$ref": "inst/B/zext.h.yaml"
      }
    },
    "C": {
      "c.add": {
        "$ref": "inst/C/c.add.yaml"
      },
      "c.addi": {
        "$ref": "inst/C/c.addi.yaml"
      },
      "c.addi16sp": {
        "$ref": "inst/C/c.addi16sp.yaml"
      },
      "c.addi4spn": {
        "$ref": "inst/C/c.addi4spn.yaml"
      },
      "c.addiw": {
        "$ref": "inst/C/c.addiw.yaml"
      },
      "c.addw": {
        "$ref": "inst/C/c.addw.yaml"
      },
      "c.and": {
        "$ref": "inst/C/c.and.yaml"
      },
      "c.andi": {
        "$ref": "inst/C/c.andi.yaml"
      },
      "c.beqz": {
        "$ref": "inst/C/c.beqz.yaml"
      },
      "c.bnez": {
        "$ref": "inst/C/c.bnez.yaml"
      },
      "c.ebreak": {
        "$ref": "inst/C/c.ebreak.yaml"
      },
      "c.fld": {
        "$ref": "inst/C/c.fld.yaml"
      },
      "c.fldsp": {
        "$ref": "inst/C/c.fldsp.yaml"
      },
      "c.flw": {
        "$ref": "inst/C/c.flw.yaml"
      },
      "c.flwsp": {
        "$ref": "inst/C/c.flwsp.yaml"
      },
      "c.fsd": {
        "$ref": "inst/C/c.fsd.yaml"
      },
      "c.fsdsp": {
        "$ref": "inst/C/c.fsdsp.yaml"
      },
      "c.fsw": {
        "$ref": "inst/C/c.fsw.yaml"
      },
      "c.fswsp": {
        "$ref": "inst/C/c.fswsp.yaml"
      },
      "c.j": {
        "$ref": "inst/C/c.j.yaml"
      },
      "c.jal": {
        "$ref": "inst/C/c.jal.yaml"
      },
      "c.jalr": {
        "$ref": "inst/C/c.jalr.yaml"
      },
      "c.jr": {
        "$ref": "inst/C/c.jr.yaml"
      },
      "c.ld": {
        "$ref": "inst/C/c.ld.yaml"
      },
      "c.ldsp": {
        "$ref": "inst/C/c.ldsp.yaml"
      },
      "c.li": {
        "$ref": "inst/C/c.li.yaml"
      },
      "c.lui": {
        "$ref": "inst/C/c.lui.yaml"
      },
      "c.lw": {
        "$ref": "inst/C/c.lw.yaml"
      },
      "c.lwsp": {
        "$ref": "inst/C/c.lwsp.yaml"
      },
      "c.mv": {
        "$ref": "inst/C/c.mv.yaml"
      },
      "c.nop": {
        "$ref": "inst/C/c.nop.yaml"
      },
      "c.or": {
        "$ref": "inst/C/c.or.yaml"
      },
      "c.sd": {
        "$ref": "inst/C/c.sd.yaml"
      },
      "c.sdsp": {
        "$ref": "inst/C/c.sdsp.yaml"
      },
      "c.slli": {
        "$ref": "inst/C/c.slli.yaml"
      },
      "c.srai": {
        "$ref": "inst/C/c.srai.yaml"
      },
      "c.srli": {
        "$ref": "inst/C/c.srli.yaml"
      },
      "c.sub": {
        "$ref": "inst/C/c.sub.yaml"
      },
      "c.subw": {
        "$ref": "inst/C/c.subw.yaml"
      },
      "c.sw": {
        "$ref": "inst/C/c.sw.yaml"
      },
      "c.swsp": {
        "$ref": "inst/C/c.swsp.yaml"
      },
      "c.xor": {
        "$ref": "inst/C/c.xor.yaml"
      }
    },
    "D": {
      "fadd.d": {
        "$ref": "inst/D/fadd.d.yaml"
      },
      "fclass.d": {
        "$ref": "inst/D/fclass.d.yaml"
      },
      "fcvt.d.l": {
        "$ref": "inst/D/fcvt.d.l.yaml"
      },
      "fcvt.d.lu": {
        "$ref": "inst/D/fcvt.d.lu.yaml"
      },
      "fcvt.d.s": {
        "$ref": "inst/D/fcvt.d.s.yaml"
      },
      "fcvt.d.w": {
        "$ref": "inst/D/fcvt.d.w.yaml"
      },
      "fcvt.d.wu": {
        "$ref": "inst/D/fcvt.d.wu.yaml"
      },
      "fcvt.l.d": {
        "$ref": "inst/D/fcvt.l.d.yaml"
      },
      "fcvt.lu.d": {
        "$ref": "inst/D/fcvt.lu.d.yaml"
      },
      "fcvt.s.d": {
        "$ref": "inst/D/fcvt.s.d.yaml"
      },
      "fcvt.w.d": {
        "$ref": "inst/D/fcvt.w.d.yaml"
      },
      "fcvt.wu.d": {
        "$ref": "inst/D/fcvt.wu.d.yaml"
      },
      "fcvtmod.w.d": {
        "$ref": "inst/D/fcvtmod.w.d.yaml"
      },
      "fdiv.d": {
        "$ref": "inst/D/fdiv.d.yaml"
      },
      "feq.d": {
        "$ref": "inst/D/feq.d.yaml"
      },
      "fld": {
        "$ref": "inst/D/fld.yaml"
      },
      "fle.d": {
        "$ref": "inst/D/fle.d.yaml"
      },
      "fleq.d": {
        "$ref": "inst/D/fleq.d.yaml"
      },
      "fli.d": {
        "$ref": "inst/D/fli.d.yaml"
      },
      "flt.d": {
        "$ref": "inst/D/flt.d.yaml"
      },
      "fltq.d": {
        "$ref": "inst/D/fltq.d.yaml"
      },
      "fmadd.d": {
        "$ref": "inst/D/fmadd.d.yaml"
      },
      "fmax.d": {
        "$ref": "inst/D/fmax.d.yaml"
      },
      "fmaxm.d": {
        "$ref": "inst/D/fmaxm.d.yaml"
      },
      "fmin.d": {
        "$ref": "inst/D/fmin.d.yaml"
      },
      "fminm.d": {
        "$ref": "inst/D/fminm.d.yaml"
      },
      "fmsub.d": {
        "$ref": "inst/D/fmsub.d.yaml"
      },
      "fmul.d": {
        "$ref": "inst/D/fmul.d.yaml"
      },
      "fmv.d.x": {
        "$ref": "inst/D/fmv.d.x.yaml"
      },
      "fmv.x.d": {
        "$ref": "inst/D/fmv.x.d.yaml"
      },
      "fmvh.x.d": {
        "$ref": "inst/D/fmvh.x.d.yaml"
      },
      "fmvp.d.x": {
        "$ref": "inst/D/fmvp.d.x.yaml"
      },
      "fnmadd.d": {
        "$ref": "inst/D/fnmadd.d.yaml"
      },
      "fnmsub.d": {
        "$ref": "inst/D/fnmsub.d.yaml"
      },
      "fround.d": {
        "$ref": "inst/D/fround.d.yaml"
      },
      "froundnx.d": {
        "$ref": "inst/D/froundnx.d.yaml"
      },
      "fsd": {
        "$ref": "inst/D/fsd.yaml"
      },
      "fsgnj.d": {
        "$ref": "inst/D/fsgnj.d.yaml"
      },
      "fsgnjn.d": {
        "$ref": "inst/D/fsgnjn.d.yaml"
      },
      "fsgnjx.d": {
        "$ref": "inst/D/fsgnjx.d.yaml"
      },
      "fsqrt.d": {
        "$ref": "inst/D/fsqrt.d.yaml"
      },
      "fsub.d": {
        "$ref": "inst/D/fsub.d.yaml"
      }
    },
    "F": {
      "fadd.s": {
        "$ref": "inst/F/fadd.s.yaml"
      },
      "fclass.s": {
        "$ref": "inst/F/fclass.s.yaml"
      },
      "fcvt.l.s": {
        "$ref": "inst/F/fcvt.l.s.yaml"
      },
      "fcvt.lu.s": {
        "$ref": "inst/F/fcvt.lu.s.yaml"
      },
      "fcvt.s.l": {
        "$ref": "inst/F/fcvt.s.l.yaml"
      },
      "fcvt.s.lu": {
        "$ref": "inst/F/fcvt.s.lu.yaml"
      },
      "fcvt.s.w": {
        "$ref": "inst/F/fcvt.s.w.yaml"
      },
      "fcvt.s.wu": {
        "$ref": "inst/F/fcvt.s.wu.yaml"
      },
      "fcvt.w.s": {
        "$ref": "inst/F/fcvt.w.s.yaml"
      },
      "fcvt.wu.s": {
        "$ref": "inst/F/fcvt.wu.s.yaml"
      },
      "fdiv.s": {
        "$ref": "inst/F/fdiv.s.yaml"
      },
      "feq.s": {
        "$ref": "inst/F/feq.s.yaml"
      },
      "fle.s": {
        "$ref": "inst/F/fle.s.yaml"
      },
      "fleq.s": {
        "$ref": "inst/F/fleq.s.yaml"
      },
      "fli.s": {
        "$ref": "inst/F/fli.s.yaml"
      },
      "flt.s": {
        "$ref": "inst/F/flt.s.yaml"
      },
      "fltq.s": {
        "$ref": "inst/F/fltq.s.yaml"
      },
      "flw": {
        "$ref": "inst/F/flw.yaml"
      },
      "fmadd.s": {
        "$ref": "inst/F/fmadd.s.yaml"
      },
      "fmax.s": {
        "$ref": "inst/F/fmax.s.yaml"
      },
      "fmaxm.s": {
        "$ref": "inst/F/fmaxm.s.yaml"
      },
      "fmin.s": {
        "$ref": "inst/F/fmin.s.yaml"
      },
      "fminm.s": {
        "$ref": "inst/F/fminm.s.yaml"
      },
      "fmsub.s": {
        "$ref": "inst/F/fmsub.s.yaml"
      },
      "fmul.s": {
        "$ref": "inst/F/fmul.s.yaml"
      },
      "fmv.w.x": {
        "$ref": "inst/F/fmv.w.x.yaml"
      },
      "fmv.x.w": {
        "$ref": "inst/F/fmv.x.w.yaml"
      },
      "fnmadd.s": {
        "$ref": "inst/F/fnmadd.s.yaml"
      },
      "fnmsub.s": {
        "$ref": "inst/F/fnmsub.s.yaml"
      },
      "fround.s": {
        "$ref": "inst/F/fround.s.yaml"
      },
      "froundnx.s": {
        "$ref": "inst/F/froundnx.s.yaml"
      },
      "fsgnj.s": {
        "$ref": "inst/F/fsgnj.s.yaml"
      },
      "fsgnjn.s": {
        "$ref": "inst/F/fsgnjn.s.yaml"
      },
      "fsgnjx.s": {
        "$ref": "inst/F/fsgnjx.s.yaml"
      },
      "fsqrt.s": {
        "$ref": "inst/F/fsqrt.s.yaml"
      },
      "fsub.s": {
        "$ref": "inst/F/fsub.s.yaml"
      },
      "fsw": {
        "$ref": "inst/F/fsw.yaml"
      }
    },
    "H": {
      "hfence.gvma": {
        "$ref": "inst/H/hfence.gvma.yaml"
      },
      "hfence.vvma": {
        "$ref": "inst/H/hfence.vvma.yaml"
      },
      "hlv.b": {
        "$ref": "inst/H/hlv.b.yaml"
      },
      "hlv.bu": {
        "$ref": "inst/H/hlv.bu.yaml"
      },
      "hlv.d": {
        "$ref": "inst/H/hlv.d.yaml"
      },
      "hlv.h": {
        "$ref": "inst/H/hlv.h.yaml"
      },
      "hlv.hu": {
        "$ref": "inst/H/hlv.hu.yaml"
      },
      "hlv.w": {
        "$ref": "inst/H/hlv.w.yaml"
      },
      "hlv.wu": {
        "$ref": "inst/H/hlv.wu.yaml"
      },
      "hlvx.hu": {
        "$ref": "inst/H/hlvx.hu.yaml"
      },
      "hlvx.wu": {
        "$ref": "inst/H/hlvx.wu.yaml"
      },
      "hsv.b": {
        "$ref": "inst/H/hsv.b.yaml"
      },
      "hsv.d": {
        "$ref": "inst/H/hsv.d.yaml"
      },
      "hsv.h": {
        "$ref": "inst/H/hsv.h.yaml"
      },
      "hsv.w": {
        "$ref": "inst/H/hsv.w.yaml"
      }
    },
    "I": {
      "add": {
        "$ref": "inst/I/add.yaml"
      },
      "addi": {
        "$ref": "inst/I/addi.yaml"
      },
      "addiw": {
        "$ref": "inst/I/addiw.yaml"
      },
      "addw": {
        "$ref": "inst/I/addw.yaml"
      },
      "and": {
        "$ref": "inst/I/and.yaml"
      },
      "andi": {
        "$ref": "inst/I/andi.yaml"
      },
      "auipc": {
        "$ref": "inst/I/auipc.yaml"
      },
      "beq": {
        "$ref": "inst/I/beq.yaml"
      },
      "bge": {
        "$ref": "inst/I/bge.yaml"
      },
      "bgeu": {
        "$ref": "inst/I/bgeu.yaml"
      },
      "blt": {
        "$ref": "inst/I/blt.yaml"
      },
      "bltu": {
        "$ref": "inst/I/bltu.yaml"
      },
      "bne": {
        "$ref": "inst/I/bne.yaml"
      },
      "ebreak": {
        "$ref": "inst/I/ebreak.yaml"
      },
      "ecall": {
        "$ref": "inst/I/ecall.yaml"
      },
      "fence": {
        "$ref": "inst/I/fence.yaml"
      },
      "jal": {
        "$ref": "inst/I/jal.yaml"
      },
      "jalr": {
        "$ref": "inst/I/jalr.yaml"
      },
      "lb": {
        "$ref": "inst/I/lb.yaml"
      },
      "lbu": {
        "$ref": "inst/I/lbu.yaml"
      },
      "ld": {
        "$ref": "inst/I/ld.yaml"
      },
      "lh": {
        "$ref": "inst/I/lh.yaml"
      },
      "lhu": {
        "$ref": "inst/I/lhu.yaml"
      },
      "lui": {
        "$ref": "inst/I/lui.yaml"
      },
      "lw": {
        "$ref": "inst/I/lw.yaml"
      },
      "lwu": {
        "$ref": "inst/I/lwu.yaml"
      },
      "mret": {
        "$ref": "inst/I/mret.yaml"
      },
      "or": {
        "$ref": "inst/I/or.yaml"
      },
      "ori": {
        "$ref": "inst/I/ori.yaml"
      },
      "sb": {
        "$ref": "inst/I/sb.yaml"
      },
      "sd": {
        "$ref": "inst/I/sd.yaml"
      },
      "sh": {
        "$ref": "inst/I/sh.yaml"
      },
      "sll": {
        "$ref": "inst/I/sll.yaml"
      },
      "slli": {
        "$ref": "inst/I/slli.yaml"
      },
      "slliw": {
        "$ref": "inst/I/slliw.yaml"
      },
      "sllw": {
        "$ref": "inst/I/sllw.yaml"
      },
      "slt": {
        "$ref": "inst/I/slt.yaml"
      },
      "slti": {
        "$ref": "inst/I/slti.yaml"
      },
      "sltiu": {
        "$ref": "inst/I/sltiu.yaml"
      },
      "sltu": {
        "$ref": "inst/I/sltu.yaml"
      },
      "sra": {
        "$ref": "inst/I/sra.yaml"
      },
      "srai": {
        "$ref": "inst/I/srai.yaml"
      },
      "sraiw": {
        "$ref": "inst/I/sraiw.yaml"
      },
      "sraw": {
        "$ref": "inst/I/sraw.yaml"
      },
      "srl": {
        "$ref": "inst/I/srl.yaml"
      },
      "srli": {
        "$ref": "inst/I/srli.yaml"
      },
      "srliw": {
        "$ref": "inst/I/srliw.yaml"
      },
      "srlw": {
        "$ref": "inst/I/srlw.yaml"
      },
      "sub": {
        "$ref": "inst/I/sub.yaml"
      },
      "subw": {
        "$ref": "inst/I/subw.yaml"
      },
      "sw": {
        "$ref": "inst/I/sw.yaml"
      },
      "wfi": {
        "$ref": "inst/I/wfi.yaml"
      },
      "xor": {
        "$ref": "inst/I/xor.yaml"
      },
      "xori": {
        "$ref": "inst/I/xori.yaml"
      }
    },
    "M": {
      "div": {
        "$ref": "inst/M/div.yaml"
      },
      "divu": {
        "$ref": "inst/M/divu.yaml"
      },
      "divuw": {
        "$ref": "inst/M/divuw.yaml"
      },
      "divw": {
        "$ref": "inst/M/divw.yaml"
      },
      "mul": {
        "$ref": "inst/M/mul.yaml"
      },
      "mulh": {
        "$ref": "inst/M/mulh.yaml"
      },
      "mulhsu": {
        "$ref": "inst/M/mulhsu.yaml"
      },
      "mulhu": {
        "$ref": "inst/M/mulhu.yaml"
      },
      "mulw": {
        "$ref": "inst/M/mulw.yaml"
      },
      "rem": {
        "$ref": "inst/M/rem.yaml"
      },
      "remu": {
        "$ref": "inst/M/remu.yaml"
      },
      "remuw": {
        "$ref": "inst/M/remuw.yaml"
      },
      "remw": {
        "$ref": "inst/M/remw.yaml"
      }
    },
    "Q": {
      "fadd.q": {
        "$ref": "inst/Q/fadd.q.yaml"
      },
      "fclass.q": {
        "$ref": "inst/Q/fclass.q.yaml"
      },
      "fcvt.d.q": {
        "$ref": "inst/Q/fcvt.d.q.yaml"
      },
      "fcvt.h.q": {
        "$ref": "inst/Q/fcvt.h.q.yaml"
      },
      "fcvt.l.q": {
        "$ref": "inst/Q/fcvt.l.q.yaml"
      },
      "fcvt.lu.q": {
        "$ref": "inst/Q/fcvt.lu.q.yaml"
      },
      "fcvt.q.d": {
        "$ref": "inst/Q/fcvt.q.d.yaml"
      },
      "fcvt.q.h": {
        "$ref": "inst/Q/fcvt.q.h.yaml"
      },
      "fcvt.q.l": {
        "$ref": "inst/Q/fcvt.q.l.yaml"
      },
      "fcvt.q.lu": {
        "$ref": "inst/Q/fcvt.q.lu.yaml"
      },
      "fcvt.q.s": {
        "$ref": "inst/Q/fcvt.q.s.yaml"
      },
      "fcvt.q.w": {
        "$ref": "inst/Q/fcvt.q.w.yaml"
      },
      "fcvt.q.wu": {
        "$ref": "inst/Q/fcvt.q.wu.yaml"
      },
      "fcvt.s.q": {
        "$ref": "inst/Q/fcvt.s.q.yaml"
      },
      "fcvt.w.q": {
        "$ref": "inst/Q/fcvt.w.q.yaml"
      },
      "fcvt.wu.q": {
        "$ref": "inst/Q/fcvt.wu.q.yaml"
      },
      "fdiv.q": {
        "$ref": "inst/Q/fdiv.q.yaml"
      },
      "feq.q": {
        "$ref": "inst/Q/feq.q.yaml"
      },
      "fle.q": {
        "$ref": "inst/Q/fle.q.yaml"
      },
      "fleq.q": {
        "$ref": "inst/Q/fleq.q.yaml"
      },
      "fli.q": {
        "$ref": "inst/Q/fli.q.yaml"
      },
      "flq": {
        "$ref": "inst/Q/flq.yaml"
      },
      "flt.q": {
        "$ref": "inst/Q/flt.q.yaml"
      },
      "fltq.q": {
        "$ref": "inst/Q/fltq.q.yaml"
      },
      "fmadd.q": {
        "$ref": "inst/Q/fmadd.q.yaml"
      },
      "fmax.q": {
        "$ref": "inst/Q/fmax.q.yaml"
      },
      "fmaxm.q": {
        "$ref": "inst/Q/fmaxm.q.yaml"
      },
      "fmin.q": {
        "$ref": "inst/Q/fmin.q.yaml"
      },
      "fminm.q": {
        "$ref": "inst/Q/fminm.q.yaml"
      },
      "fmsub.q": {
        "$ref": "inst/Q/fmsub.q.yaml"
      },
      "fmul.q": {
        "$ref": "inst/Q/fmul.q.yaml"
      },
      "fmvh.x.q": {
        "$ref": "inst/Q/fmvh.x.q.yaml"
      },
      "fmvp.q.x": {
        "$ref": "inst/Q/fmvp.q.x.yaml"
      },
      "fnmadd.q": {
        "$ref": "inst/Q/fnmadd.q.yaml"
      },
      "fnmsub.q": {
        "$ref": "inst/Q/fnmsub.q.yaml"
      },
      "fround.q": {
        "$ref": "inst/Q/fround.q.yaml"
      },
      "froundnx.q": {
        "$ref": "inst/Q/froundnx.q.yaml"
      },
      "fsgnj.q": {
        "$ref": "inst/Q/fsgnj.q.yaml"
      },
      "fsgnjn.q": {
        "$ref": "inst/Q/fsgnjn.q.yaml"
      },
      "fsgnjx.q": {
        "$ref": "inst/Q/fsgnjx.q.yaml"
      },
      "fsq": {
        "$ref": "inst/Q/fsq.yaml"
      },
      "fsqrt.q": {
        "$ref": "inst/Q/fsqrt.q.yaml"
      },
      "fsub.q": {
        "$ref": "inst/Q/fsub.q.yaml"
      }
    },
    "S": {
      "sfence.vma": {
        "$ref": "inst/S/sfence.vma.yaml"
      },
      "sret": {
        "$ref": "inst/S/sret.yaml"
      }
    },
    "Sdext": {
      "dret": {
        "$ref": "inst/Sdext/dret.yaml"
      }
    },
    "Smdbltrp": {
      "sctrclr": {
        "$ref": "inst/Smdbltrp/sctrclr.yaml"
      }
    },
    "Smrnmi": {
      "mnret": {
        "$ref": "inst/Smrnmi/mnret.yaml"
      }
    },
    "Svinval": {
      "hinval.gvma": {
        "$ref": "inst/Svinval/hinval.gvma.yaml"
      },
      "hinval.vvma": {
        "$ref": "inst/Svinval/hinval.vvma.yaml"
      },
      "sfence.inval.ir": {
        "$ref": "inst/Svinval/sfence.inval.ir.yaml"
      },
      "sfence.w.inval": {
        "$ref": "inst/Svinval/sfence.w.inval.yaml"
      },
      "sinval.vma": {
        "$ref": "inst/Svinval/sinval.vma.yaml"
      }
    },
    "V": {
      "vaadd.vv": {
        "$ref": "inst/V/vaadd.vv.yaml"
      },
      "vaadd.vx": {
        "$ref": "inst/V/vaadd.vx.yaml"
      },
      "vaaddu.vv": {
        "$ref": "inst/V/vaaddu.vv.yaml"
      },
      "vaaddu.vx": {
        "$ref": "inst/V/vaaddu.vx.yaml"
      },
      "vadc.vim": {
        "$ref": "inst/V/vadc.vim.yaml"
      },
      "vadc.vvm": {
        "$ref": "inst/V/vadc.vvm.yaml"
      },
      "vadc.vxm": {
        "$ref": "inst/V/vadc.vxm.yaml"
      },
      "vadd.vi": {
        "$ref": "inst/V/vadd.vi.yaml"
      },
      "vadd.vv": {
        "$ref": "inst/V/vadd.vv.yaml"
      },
      "vadd.vx": {
        "$ref": "inst/V/vadd.vx.yaml"
      },
      "vand.vi": {
        "$ref": "inst/V/vand.vi.yaml"
      },
      "vand.vv": {
        "$ref": "inst/V/vand.vv.yaml"
      },
      "vand.vx": {
        "$ref": "inst/V/vand.vx.yaml"
      },
      "vasub.vv": {
        "$ref": "inst/V/vasub.vv.yaml"
      },
      "vasub.vx": {
        "$ref": "inst/V/vasub.vx.yaml"
      },
      "vasubu.vv": {
        "$ref": "inst/V/vasubu.vv.yaml"
      },
      "vasubu.vx": {
        "$ref": "inst/V/vasubu.vx.yaml"
      },
      "vcompress.vm": {
        "$ref": "inst/V/vcompress.vm.yaml"
      },
      "vcpop.m": {
        "$ref": "inst/V/vcpop.m.yaml"
      },
      "vdiv.vv": {
        "$ref": "inst/V/vdiv.vv.yaml"
      },
      "vdiv.vx": {
        "$ref": "inst/V/vdiv.vx.yaml"
      },
      "vdivu.vv": {
        "$ref": "inst/V/vdivu.vv.yaml"
      },
      "vdivu.vx": {
        "$ref": "inst/V/vdivu.vx.yaml"
      },
      "vfadd.vf": {
        "$ref": "inst/V/vfadd.vf.yaml"
      },
      "vfadd.vv": {
        "$ref": "inst/V/vfadd.vv.yaml"
      },
      "vfclass.v": {
        "$ref": "inst/V/vfclass.v.yaml"
      },
      "vfcvt.f.x.v": {
        "$ref": "inst/V/vfcvt.f.x.v.yaml"
      },
      "vfcvt.f.xu.v": {
        "$ref": "inst/V/vfcvt.f.xu.v.yaml"
      },
      "vfcvt.rtz.x.f.v": {
        "$ref": "inst/V/vfcvt.rtz.x.f.v.yaml"
      },
      "vfcvt.rtz.xu.f.v": {
        "$ref": "inst/V/vfcvt.rtz.xu.f.v.yaml"
      },
      "vfcvt.x.f.v": {
        "$ref": "inst/V/vfcvt.x.f.v.yaml"
      },
      "vfcvt.xu.f.v": {
        "$ref": "inst/V/vfcvt.xu.f.v.yaml"
      },
      "vfdiv.vf": {
        "$ref": "inst/V/vfdiv.vf.yaml"
      },
      "vfdiv.vv": {
        "$ref": "inst/V/vfdiv.vv.yaml"
      },
      "vfirst.m": {
        "$ref": "inst/V/vfirst.m.yaml"
      },
      "vfmacc.vf": {
        "$ref": "inst/V/vfmacc.vf.yaml"
      },
      "vfmacc.vv": {
        "$ref": "inst/V/vfmacc.vv.yaml"
      },
      "vfmadd.vf": {
        "$ref": "inst/V/vfmadd.vf.yaml"
      },
      "vfmadd.vv": {
        "$ref": "inst/V/vfmadd.vv.yaml"
      },
      "vfmax.vf": {
        "$ref": "inst/V/vfmax.vf.yaml"
      },
      "vfmax.vv": {
        "$ref": "inst/V/vfmax.vv.yaml"
      },
      "vfmerge.vfm": {
        "$ref": "inst/V/vfmerge.vfm.yaml"
      },
      "vfmin.vf": {
        "$ref": "inst/V/vfmin.vf.yaml"
      },
      "vfmin.vv": {
        "$ref": "inst/V/vfmin.vv.yaml"
      },
      "vfmsac.vf": {
        "$ref": "inst/V/vfmsac.vf.yaml"
      },
      "vfmsac.vv": {
        "$ref": "inst/V/vfmsac.vv.yaml"
      },
      "vfmsub.vf": {
        "$ref": "inst/V/vfmsub.vf.yaml"
      },
      "vfmsub.vv": {
        "$ref": "inst/V/vfmsub.vv.yaml"
      },
      "vfmul.vf": {
        "$ref": "inst/V/vfmul.vf.yaml"
      },
      "vfmul.vv": {
        "$ref": "inst/V/vfmul.vv.yaml"
      },
      "vfmv.f.s": {
        "$ref": "inst/V/vfmv.f.s.yaml"
      },
      "vfmv.s.f": {
        "$ref": "inst/V/vfmv.s.f.yaml"
      },
      "vfmv.v.f": {
        "$ref": "inst/V/vfmv.v.f.yaml"
      },
      "vfncvt.f.f.w": {
        "$ref": "inst/V/vfncvt.f.f.w.yaml"
      },
      "vfncvt.f.x.w": {
        "$ref": "inst/V/vfncvt.f.x.w.yaml"
      },
      "vfncvt.f.xu.w": {
        "$ref": "inst/V/vfncvt.f.xu.w.yaml"
      },
      "vfncvt.rod.f.f.w": {
        "$ref": "inst/V/vfncvt.rod.f.f.w.yaml"
      },
      "vfncvt.rtz.x.f.w": {
        "$ref": "inst/V/vfncvt.rtz.x.f.w.yaml"
      },
      "vfncvt.rtz.xu.f.w": {
        "$ref": "inst/V/vfncvt.rtz.xu.f.w.yaml"
      },
      "vfncvt.x.f.w": {
        "$ref": "inst/V/vfncvt.x.f.w.yaml"
      },
      "vfncvt.xu.f.w": {
        "$ref": "inst/V/vfncvt.xu.f.w.yaml"
      },
      "vfnmacc.vf": {
        "$ref": "inst/V/vfnmacc.vf.yaml"
      },
      "vfnmacc.vv": {
        "$ref": "inst/V/vfnmacc.vv.yaml"
      },
      "vfnmadd.vf": {
        "$ref": "inst/V/vfnmadd.vf.yaml"
      },
      "vfnmadd.vv": {
        "$ref": "inst/V/vfnmadd.vv.yaml"
      },
      "vfnmsac.vf": {
        "$ref": "inst/V/vfnmsac.vf.yaml"
      },
      "vfnmsac.vv": {
        "$ref": "inst/V/vfnmsac.vv.yaml"
      },
      "vfnmsub.vf": {
        "$ref": "inst/V/vfnmsub.vf.yaml"
      },
      "vfnmsub.vv": {
        "$ref": "inst/V/vfnmsub.vv.yaml"
      },
      "vfrdiv.vf": {
        "$ref": "inst/V/vfrdiv.vf.yaml"
      },
      "vfrec7.v": {
        "$ref": "inst/V/vfrec7.v.yaml"
      },
      "vfredmax.vs": {
        "$ref": "inst/V/vfredmax.vs.yaml"
      },
      "vfredmin.vs": {
        "$ref": "inst/V/vfredmin.vs.yaml"
      },
      "vfredosum.vs": {
        "$ref": "inst/V/vfredosum.vs.yaml"
      },
      "vfredusum.vs": {
        "$ref": "inst/V/vfredusum.vs.yaml"
      },
      "vfrsqrt7.v": {
        "$ref": "inst/V/vfrsqrt7.v.yaml"
      },
      "vfrsub.vf": {
        "$ref": "inst/V/vfrsub.vf.yaml"
      },
      "vfsgnj.vf": {
        "$ref": "inst/V/vfsgnj.vf.yaml"
      },
      "vfsgnj.vv": {
        "$ref": "inst/V/vfsgnj.vv.yaml"
      },
      "vfsgnjn.vf": {
        "$ref": "inst/V/vfsgnjn.vf.yaml"
      },
      "vfsgnjn.vv": {
        "$ref": "inst/V/vfsgnjn.vv.yaml"
      },
      "vfsgnjx.vf": {
        "$ref": "inst/V/vfsgnjx.vf.yaml"
      },
      "vfsgnjx.vv": {
        "$ref": "inst/V/vfsgnjx.vv.yaml"
      },
      "vfslide1down.vf": {
        "$ref": "inst/V/vfslide1down.vf.yaml"
      },
      "vfslide1up.vf": {
        "$ref": "inst/V/vfslide1up.vf.yaml"
      },
      "vfsqrt.v": {
        "$ref": "inst/V/vfsqrt.v.yaml"
      },
      "vfsub.vf": {
        "$ref": "inst/V/vfsub.vf.yaml"
      },
      "vfsub.vv": {
        "$ref": "inst/V/vfsub.vv.yaml"
      },
      "vfwadd.vf": {
        "$ref": "inst/V/vfwadd.vf.yaml"
      },
      "vfwadd.vv": {
        "$ref": "inst/V/vfwadd.vv.yaml"
      },
      "vfwadd.wf": {
        "$ref": "inst/V/vfwadd.wf.yaml"
      },
      "vfwadd.wv": {
        "$ref": "inst/V/vfwadd.wv.yaml"
      },
      "vfwcvt.f.f.v": {
        "$ref": "inst/V/vfwcvt.f.f.v.yaml"
      },
      "vfwcvt.f.x.v": {
        "$ref": "inst/V/vfwcvt.f.x.v.yaml"
      },
      "vfwcvt.f.xu.v": {
        "$ref": "inst/V/vfwcvt.f.xu.v.yaml"
      },
      "vfwcvt.rtz.x.f.v": {
        "$ref": "inst/V/vfwcvt.rtz.x.f.v.yaml"
      },
      "vfwcvt.rtz.xu.f.v": {
        "$ref": "inst/V/vfwcvt.rtz.xu.f.v.yaml"
      },
      "vfwcvt.x.f.v": {
        "$ref": "inst/V/vfwcvt.x.f.v.yaml"
      },
      "vfwcvt.xu.f.v": {
        "$ref": "inst/V/vfwcvt.xu.f.v.yaml"
      },
      "vfwmacc.vf": {
        "$ref": "inst/V/vfwmacc.vf.yaml"
      },
      "vfwmacc.vv": {
        "$ref": "inst/V/vfwmacc.vv.yaml"
      },
      "vfwmsac.vf": {
        "$ref": "inst/V/vfwmsac.vf.yaml"
      },
      "vfwmsac.vv": {
        "$ref": "inst/V/vfwmsac.vv.yaml"
      },
      "vfwmul.vf": {
        "$ref": "inst/V/vfwmul.vf.yaml"
      },
      "vfwmul.vv": {
        "$ref": "inst/V/vfwmul.vv.yaml"
      },
      "vfwnmacc.vf": {
        "$ref": "inst/V/vfwnmacc.vf.yaml"
      },
      "vfwnmacc.vv": {
        "$ref": "inst/V/vfwnmacc.vv.yaml"
      },
      "vfwnmsac.vf": {
        "$ref": "inst/V/vfwnmsac.vf.yaml"
      },
      "vfwnmsac.vv": {
        "$ref": "inst/V/vfwnmsac.vv.yaml"
      },
      "vfwredosum.vs": {
        "$ref": "inst/V/vfwredosum.vs.yaml"
      },
      "vfwredusum.vs": {
        "$ref": "inst/V/vfwredusum.vs.yaml"
      },
      "vfwsub.vf": {
        "$ref": "inst/V/vfwsub.vf.yaml"
      },
      "vfwsub.vv": {
        "$ref": "inst/V/vfwsub.vv.yaml"
      },
      "vfwsub.wf": {
        "$ref": "inst/V/vfwsub.wf.yaml"
      },
      "vfwsub.wv": {
        "$ref": "inst/V/vfwsub.wv.yaml"
      },
      "vid.v": {
        "$ref": "inst/V/vid.v.yaml"
      },
      "viota.m": {
        "$ref": "inst/V/viota.m.yaml"
      },
      "vl1re16.v": {
        "$ref": "inst/V/vl1re16.v.yaml"
      },
      "vl1re32.v": {
        "$ref": "inst/V/vl1re32.v.yaml"
      },
      "vl1re64.v": {
        "$ref": "inst/V/vl1re64.v.yaml"
      },
      "vl1re8.v": {
        "$ref": "inst/V/vl1re8.v.yaml"
      },
      "vl2re16.v": {
        "$ref": "inst/V/vl2re16.v.yaml"
      },
      "vl2re32.v": {
        "$ref": "inst/V/vl2re32.v.yaml"
      },
      "vl2re64.v": {
        "$ref": "inst/V/vl2re64.v.yaml"
      },
      "vl2re8.v": {
        "$ref": "inst/V/vl2re8.v.yaml"
      },
      "vl4re16.v": {
        "$ref": "inst/V/vl4re16.v.yaml"
      },
      "vl4re32.v": {
        "$ref": "inst/V/vl4re32.v.yaml"
      },
      "vl4re64.v": {
        "$ref": "inst/V/vl4re64.v.yaml"
      },
      "vl4re8.v": {
        "$ref": "inst/V/vl4re8.v.yaml"
      },
      "vl8re16.v": {
        "$ref": "inst/V/vl8re16.v.yaml"
      },
      "vl8re32.v": {
        "$ref": "inst/V/vl8re32.v.yaml"
      },
      "vl8re64.v": {
        "$ref": "inst/V/vl8re64.v.yaml"
      },
      "vl8re8.v": {
        "$ref": "inst/V/vl8re8.v.yaml"
      },
      "vle16.v": {
        "$ref": "inst/V/vle16.v.yaml"
      },
      "vle16ff.v": {
        "$ref": "inst/V/vle16ff.v.yaml"
      },
      "vle32.v": {
        "$ref": "inst/V/vle32.v.yaml"
      },
      "vle32ff.v": {
        "$ref": "inst/V/vle32ff.v.yaml"
      },
      "vle64.v": {
        "$ref": "inst/V/vle64.v.yaml"
      },
      "vle64ff.v": {
        "$ref": "inst/V/vle64ff.v.yaml"
      },
      "vle8.v": {
        "$ref": "inst/V/vle8.v.yaml"
      },
      "vle8ff.v": {
        "$ref": "inst/V/vle8ff.v.yaml"
      },
      "vlm.v": {
        "$ref": "inst/V/vlm.v.yaml"
      },
      "vloxei16.v": {
        "$ref": "inst/V/vloxei16.v.yaml"
      },
      "vloxei32.v": {
        "$ref": "inst/V/vloxei32.v.yaml"
      },
      "vloxei64.v": {
        "$ref": "inst/V/vloxei64.v.yaml"
      },
      "vloxei8.v": {
        "$ref": "inst/V/vloxei8.v.yaml"
      },
      "vloxseg2ei16.v": {
        "$ref": "inst/V/vloxseg2ei16.v.yaml"
      },
      "vloxseg2ei32.v": {
        "$ref": "inst/V/vloxseg2ei32.v.yaml"
      },
      "vloxseg2ei64.v": {
        "$ref": "inst/V/vloxseg2ei64.v.yaml"
      },
      "vloxseg2ei8.v": {
        "$ref": "inst/V/vloxseg2ei8.v.yaml"
      },
      "vloxseg3ei16.v": {
        "$ref": "inst/V/vloxseg3ei16.v.yaml"
      },
      "vloxseg3ei32.v": {
        "$ref": "inst/V/vloxseg3ei32.v.yaml"
      },
      "vloxseg3ei64.v": {
        "$ref": "inst/V/vloxseg3ei64.v.yaml"
      },
      "vloxseg3ei8.v": {
        "$ref": "inst/V/vloxseg3ei8.v.yaml"
      },
      "vloxseg4ei16.v": {
        "$ref": "inst/V/vloxseg4ei16.v.yaml"
      },
      "vloxseg4ei32.v": {
        "$ref": "inst/V/vloxseg4ei32.v.yaml"
      },
      "vloxseg4ei64.v": {
        "$ref": "inst/V/vloxseg4ei64.v.yaml"
      },
      "vloxseg4ei8.v": {
        "$ref": "inst/V/vloxseg4ei8.v.yaml"
      },
      "vloxseg5ei16.v": {
        "$ref": "inst/V/vloxseg5ei16.v.yaml"
      },
      "vloxseg5ei32.v": {
        "$ref": "inst/V/vloxseg5ei32.v.yaml"
      },
      "vloxseg5ei64.v": {
        "$ref": "inst/V/vloxseg5ei64.v.yaml"
      },
      "vloxseg5ei8.v": {
        "$ref": "inst/V/vloxseg5ei8.v.yaml"
      },
      "vloxseg6ei16.v": {
        "$ref": "inst/V/vloxseg6ei16.v.yaml"
      },
      "vloxseg6ei32.v": {
        "$ref": "inst/V/vloxseg6ei32.v.yaml"
      },
      "vloxseg6ei64.v": {
        "$ref": "inst/V/vloxseg6ei64.v.yaml"
      },
      "vloxseg6ei8.v": {
        "$ref": "inst/V/vloxseg6ei8.v.yaml"
      },
      "vloxseg7ei16.v": {
        "$ref": "inst/V/vloxseg7ei16.v.yaml"
      },
      "vloxseg7ei32.v": {
        "$ref": "inst/V/vloxseg7ei32.v.yaml"
      },
      "vloxseg7ei64.v": {
        "$ref": "inst/V/vloxseg7ei64.v.yaml"
      },
      "vloxseg7ei8.v": {
        "$ref": "inst/V/vloxseg7ei8.v.yaml"
      },
      "vloxseg8ei16.v": {
        "$ref": "inst/V/vloxseg8ei16.v.yaml"
      },
      "vloxseg8ei32.v": {
        "$ref": "inst/V/vloxseg8ei32.v.yaml"
      },
      "vloxseg8ei64.v": {
        "$ref": "inst/V/vloxseg8ei64.v.yaml"
      },
      "vloxseg8ei8.v": {
        "$ref": "inst/V/vloxseg8ei8.v.yaml"
      },
      "vlse16.v": {
        "$ref": "inst/V/vlse16.v.yaml"
      },
      "vlse32.v": {
        "$ref": "inst/V/vlse32.v.yaml"
      },
      "vlse64.v": {
        "$ref": "inst/V/vlse64.v.yaml"
      },
      "vlse8.v": {
        "$ref": "inst/V/vlse8.v.yaml"
      },
      "vlseg2e16.v": {
        "$ref": "inst/V/vlseg2e16.v.yaml"
      },
      "vlseg2e16ff.v": {
        "$ref": "inst/V/vlseg2e16ff.v.yaml"
      },
      "vlseg2e32.v": {
        "$ref": "inst/V/vlseg2e32.v.yaml"
      },
      "vlseg2e32ff.v": {
        "$ref": "inst/V/vlseg2e32ff.v.yaml"
      },
      "vlseg2e64.v": {
        "$ref": "inst/V/vlseg2e64.v.yaml"
      },
      "vlseg2e64ff.v": {
        "$ref": "inst/V/vlseg2e64ff.v.yaml"
      },
      "vlseg2e8.v": {
        "$ref": "inst/V/vlseg2e8.v.yaml"
      },
      "vlseg2e8ff.v": {
        "$ref": "inst/V/vlseg2e8ff.v.yaml"
      },
      "vlseg3e16.v": {
        "$ref": "inst/V/vlseg3e16.v.yaml"
      },
      "vlseg3e16ff.v": {
        "$ref": "inst/V/vlseg3e16ff.v.yaml"
      },
      "vlseg3e32.v": {
        "$ref": "inst/V/vlseg3e32.v.yaml"
      },
      "vlseg3e32ff.v": {
        "$ref": "inst/V/vlseg3e32ff.v.yaml"
      },
      "vlseg3e64.v": {
        "$ref": "inst/V/vlseg3e64.v.yaml"
      },
      "vlseg3e64ff.v": {
        "$ref": "inst/V/vlseg3e64ff.v.yaml"
      },
      "vlseg3e8.v": {
        "$ref": "inst/V/vlseg3e8.v.yaml"
      },
      "vlseg3e8ff.v": {
        "$ref": "inst/V/vlseg3e8ff.v.yaml"
      },
      "vlseg4e16.v": {
        "$ref": "inst/V/vlseg4e16.v.yaml"
      },
      "vlseg4e16ff.v": {
        "$ref": "inst/V/vlseg4e16ff.v.yaml"
      },
      "vlseg4e32.v": {
        "$ref": "inst/V/vlseg4e32.v.yaml"
      },
      "vlseg4e32ff.v": {
        "$ref": "inst/V/vlseg4e32ff.v.yaml"
      },
      "vlseg4e64.v": {
        "$ref": "inst/V/vlseg4e64.v.yaml"
      },
      "vlseg4e64ff.v": {
        "$ref": "inst/V/vlseg4e64ff.v.yaml"
      },
      "vlseg4e8.v": {
        "$ref": "inst/V/vlseg4e8.v.yaml"
      },
      "vlseg4e8ff.v": {
        "$ref": "inst/V/vlseg4e8ff.v.yaml"
      },
      "vlseg5e16.v": {
        "$ref": "inst/V/vlseg5e16.v.yaml"
      },
      "vlseg5e16ff.v": {
        "$ref": "inst/V/vlseg5e16ff.v.yaml"
      },
      "vlseg5e32.v": {
        "$ref": "inst/V/vlseg5e32.v.yaml"
      },
      "vlseg5e32ff.v": {
        "$ref": "inst/V/vlseg5e32ff.v.yaml"
      },
      "vlseg5e64.v": {
        "$ref": "inst/V/vlseg5e64.v.yaml"
      },
      "vlseg5e64ff.v": {
        "$ref": "inst/V/vlseg5e64ff.v.yaml"
      },
      "vlseg5e8.v": {
        "$ref": "inst/V/vlseg5e8.v.yaml"
      },
      "vlseg5e8ff.v": {
        "$ref": "inst/V/vlseg5e8ff.v.yaml"
      },
      "vlseg6e16.v": {
        "$ref": "inst/V/vlseg6e16.v.yaml"
      },
      "vlseg6e16ff.v": {
        "$ref": "inst/V/vlseg6e16ff.v.yaml"
      },
      "vlseg6e32.v": {
        "$ref": "inst/V/vlseg6e32.v.yaml"
      },
      "vlseg6e32ff.v": {
        "$ref": "inst/V/vlseg6e32ff.v.yaml"
      },
      "vlseg6e64.v": {
        "$ref": "inst/V/vlseg6e64.v.yaml"
      },
      "vlseg6e64ff.v": {
        "$ref": "inst/V/vlseg6e64ff.v.yaml"
      },
      "vlseg6e8.v": {
        "$ref": "inst/V/vlseg6e8.v.yaml"
      },
      "vlseg6e8ff.v": {
        "$ref": "inst/V/vlseg6e8ff.v.yaml"
      },
      "vlseg7e16.v": {
        "$ref": "inst/V/vlseg7e16.v.yaml"
      },
      "vlseg7e16ff.v": {
        "$ref": "inst/V/vlseg7e16ff.v.yaml"
      },
      "vlseg7e32.v": {
        "$ref": "inst/V/vlseg7e32.v.yaml"
      },
      "vlseg7e32ff.v": {
        "$ref": "inst/V/vlseg7e32ff.v.yaml"
      },
      "vlseg7e64.v": {
        "$ref": "inst/V/vlseg7e64.v.yaml"
      },
      "vlseg7e64ff.v": {
        "$ref": "inst/V/vlseg7e64ff.v.yaml"
      },
      "vlseg7e8.v": {
        "$ref": "inst/V/vlseg7e8.v.yaml"
      },
      "vlseg7e8ff.v": {
        "$ref": "inst/V/vlseg7e8ff.v.yaml"
      },
      "vlseg8e16.v": {
        "$ref": "inst/V/vlseg8e16.v.yaml"
      },
      "vlseg8e16ff.v": {
        "$ref": "inst/V/vlseg8e16ff.v.yaml"
      },
      "vlseg8e32.v": {
        "$ref": "inst/V/vlseg8e32.v.yaml"
      },
      "vlseg8e32ff.v": {
        "$ref": "inst/V/vlseg8e32ff.v.yaml"
      },
      "vlseg8e64.v": {
        "$ref": "inst/V/vlseg8e64.v.yaml"
      },
      "vlseg8e64ff.v": {
        "$ref": "inst/V/vlseg8e64ff.v.yaml"
      },
      "vlseg8e8.v": {
        "$ref": "inst/V/vlseg8e8.v.yaml"
      },
      "vlseg8e8ff.v": {
        "$ref": "inst/V/vlseg8e8ff.v.yaml"
      },
      "vlsseg2e16.v": {
        "$ref": "inst/V/vlsseg2e16.v.yaml"
      },
      "vlsseg2e32.v": {
        "$ref": "inst/V/vlsseg2e32.v.yaml"
      },
      "vlsseg2e64.v": {
        "$ref": "inst/V/vlsseg2e64.v.yaml"
      },
      "vlsseg2e8.v": {
        "$ref": "inst/V/vlsseg2e8.v.yaml"
      },
      "vlsseg3e16.v": {
        "$ref": "inst/V/vlsseg3e16.v.yaml"
      },
      "vlsseg3e32.v": {
        "$ref": "inst/V/vlsseg3e32.v.yaml"
      },
      "vlsseg3e64.v": {
        "$ref": "inst/V/vlsseg3e64.v.yaml"
      },
      "vlsseg3e8.v": {
        "$ref": "inst/V/vlsseg3e8.v.yaml"
      },
      "vlsseg4e16.v": {
        "$ref": "inst/V/vlsseg4e16.v.yaml"
      },
      "vlsseg4e32.v": {
        "$ref": "inst/V/vlsseg4e32.v.yaml"
      },
      "vlsseg4e64.v": {
        "$ref": "inst/V/vlsseg4e64.v.yaml"
      },
      "vlsseg4e8.v": {
        "$ref": "inst/V/vlsseg4e8.v.yaml"
      },
      "vlsseg5e16.v": {
        "$ref": "inst/V/vlsseg5e16.v.yaml"
      },
      "vlsseg5e32.v": {
        "$ref": "inst/V/vlsseg5e32.v.yaml"
      },
      "vlsseg5e64.v": {
        "$ref": "inst/V/vlsseg5e64.v.yaml"
      },
      "vlsseg5e8.v": {
        "$ref": "inst/V/vlsseg5e8.v.yaml"
      },
      "vlsseg6e16.v": {
        "$ref": "inst/V/vlsseg6e16.v.yaml"
      },
      "vlsseg6e32.v": {
        "$ref": "inst/V/vlsseg6e32.v.yaml"
      },
      "vlsseg6e64.v": {
        "$ref": "inst/V/vlsseg6e64.v.yaml"
      },
      "vlsseg6e8.v": {
        "$ref": "inst/V/vlsseg6e8.v.yaml"
      },
      "vlsseg7e16.v": {
        "$ref": "inst/V/vlsseg7e16.v.yaml"
      },
      "vlsseg7e32.v": {
        "$ref": "inst/V/vlsseg7e32.v.yaml"
      },
      "vlsseg7e64.v": {
        "$ref": "inst/V/vlsseg7e64.v.yaml"
      },
      "vlsseg7e8.v": {
        "$ref": "inst/V/vlsseg7e8.v.yaml"
      },
      "vlsseg8e16.v": {
        "$ref": "inst/V/vlsseg8e16.v.yaml"
      },
      "vlsseg8e32.v": {
        "$ref": "inst/V/vlsseg8e32.v.yaml"
      },
      "vlsseg8e64.v": {
        "$ref": "inst/V/vlsseg8e64.v.yaml"
      },
      "vlsseg8e8.v": {
        "$ref": "inst/V/vlsseg8e8.v.yaml"
      },
      "vluxei16.v": {
        "$ref": "inst/V/vluxei16.v.yaml"
      },
      "vluxei32.v": {
        "$ref": "inst/V/vluxei32.v.yaml"
      },
      "vluxei64.v": {
        "$ref": "inst/V/vluxei64.v.yaml"
      },
      "vluxei8.v": {
        "$ref": "inst/V/vluxei8.v.yaml"
      },
      "vluxseg2ei16.v": {
        "$ref": "inst/V/vluxseg2ei16.v.yaml"
      },
      "vluxseg2ei32.v": {
        "$ref": "inst/V/vluxseg2ei32.v.yaml"
      },
      "vluxseg2ei64.v": {
        "$ref": "inst/V/vluxseg2ei64.v.yaml"
      },
      "vluxseg2ei8.v": {
        "$ref": "inst/V/vluxseg2ei8.v.yaml"
      },
      "vluxseg3ei16.v": {
        "$ref": "inst/V/vluxseg3ei16.v.yaml"
      },
      "vluxseg3ei32.v": {
        "$ref": "inst/V/vluxseg3ei32.v.yaml"
      },
      "vluxseg3ei64.v": {
        "$ref": "inst/V/vluxseg3ei64.v.yaml"
      },
      "vluxseg3ei8.v": {
        "$ref": "inst/V/vluxseg3ei8.v.yaml"
      },
      "vluxseg4ei16.v": {
        "$ref": "inst/V/vluxseg4ei16.v.yaml"
      },
      "vluxseg4ei32.v": {
        "$ref": "inst/V/vluxseg4ei32.v.yaml"
      },
      "vluxseg4ei64.v": {
        "$ref": "inst/V/vluxseg4ei64.v.yaml"
      },
      "vluxseg4ei8.v": {
        "$ref": "inst/V/vluxseg4ei8.v.yaml"
      },
      "vluxseg5ei16.v": {
        "$ref": "inst/V/vluxseg5ei16.v.yaml"
      },
      "vluxseg5ei32.v": {
        "$ref": "inst/V/vluxseg5ei32.v.yaml"
      },
      "vluxseg5ei64.v": {
        "$ref": "inst/V/vluxseg5ei64.v.yaml"
      },
      "vluxseg5ei8.v": {
        "$ref": "inst/V/vluxseg5ei8.v.yaml"
      },
      "vluxseg6ei16.v": {
        "$ref": "inst/V/vluxseg6ei16.v.yaml"
      },
      "vluxseg6ei32.v": {
        "$ref": "inst/V/vluxseg6ei32.v.yaml"
      },
      "vluxseg6ei64.v": {
        "$ref": "inst/V/vluxseg6ei64.v.yaml"
      },
      "vluxseg6ei8.v": {
        "$ref": "inst/V/vluxseg6ei8.v.yaml"
      },
      "vluxseg7ei16.v": {
        "$ref": "inst/V/vluxseg7ei16.v.yaml"
      },
      "vluxseg7ei32.v": {
        "$ref": "inst/V/vluxseg7ei32.v.yaml"
      },
      "vluxseg7ei64.v": {
        "$ref": "inst/V/vluxseg7ei64.v.yaml"
      },
      "vluxseg7ei8.v": {
        "$ref": "inst/V/vluxseg7ei8.v.yaml"
      },
      "vluxseg8ei16.v": {
        "$ref": "inst/V/vluxseg8ei16.v.yaml"
      },
      "vluxseg8ei32.v": {
        "$ref": "inst/V/vluxseg8ei32.v.yaml"
      },
      "vluxseg8ei64.v": {
        "$ref": "inst/V/vluxseg8ei64.v.yaml"
      },
      "vluxseg8ei8.v": {
        "$ref": "inst/V/vluxseg8ei8.v.yaml"
      },
      "vmacc.vv": {
        "$ref": "inst/V/vmacc.vv.yaml"
      },
      "vmacc.vx": {
        "$ref": "inst/V/vmacc.vx.yaml"
      },
      "vmadc.vi": {
        "$ref": "inst/V/vmadc.vi.yaml"
      },
      "vmadc.vim": {
        "$ref": "inst/V/vmadc.vim.yaml"
      },
      "vmadc.vv": {
        "$ref": "inst/V/vmadc.vv.yaml"
      },
      "vmadc.vvm": {
        "$ref": "inst/V/vmadc.vvm.yaml"
      },
      "vmadc.vx": {
        "$ref": "inst/V/vmadc.vx.yaml"
      },
      "vmadc.vxm": {
        "$ref": "inst/V/vmadc.vxm.yaml"
      },
      "vmadd.vv": {
        "$ref": "inst/V/vmadd.vv.yaml"
      },
      "vmadd.vx": {
        "$ref": "inst/V/vmadd.vx.yaml"
      },
      "vmand.mm": {
        "$ref": "inst/V/vmand.mm.yaml"
      },
      "vmandn.mm": {
        "$ref": "inst/V/vmandn.mm.yaml"
      },
      "vmax.vv": {
        "$ref": "inst/V/vmax.vv.yaml"
      },
      "vmax.vx": {
        "$ref": "inst/V/vmax.vx.yaml"
      },
      "vmaxu.vv": {
        "$ref": "inst/V/vmaxu.vv.yaml"
      },
      "vmaxu.vx": {
        "$ref": "inst/V/vmaxu.vx.yaml"
      },
      "vmerge.vim": {
        "$ref": "inst/V/vmerge.vim.yaml"
      },
      "vmerge.vvm": {
        "$ref": "inst/V/vmerge.vvm.yaml"
      },
      "vmerge.vxm": {
        "$ref": "inst/V/vmerge.vxm.yaml"
      },
      "vmfeq.vf": {
        "$ref": "inst/V/vmfeq.vf.yaml"
      },
      "vmfeq.vv": {
        "$ref": "inst/V/vmfeq.vv.yaml"
      },
      "vmfge.vf": {
        "$ref": "inst/V/vmfge.vf.yaml"
      },
      "vmfgt.vf": {
        "$ref": "inst/V/vmfgt.vf.yaml"
      },
      "vmfle.vf": {
        "$ref": "inst/V/vmfle.vf.yaml"
      },
      "vmfle.vv": {
        "$ref": "inst/V/vmfle.vv.yaml"
      },
      "vmflt.vf": {
        "$ref": "inst/V/vmflt.vf.yaml"
      },
      "vmflt.vv": {
        "$ref": "inst/V/vmflt.vv.yaml"
      },
      "vmfne.vf": {
        "$ref": "inst/V/vmfne.vf.yaml"
      },
      "vmfne.vv": {
        "$ref": "inst/V/vmfne.vv.yaml"
      },
      "vmin.vv": {
        "$ref": "inst/V/vmin.vv.yaml"
      },
      "vmin.vx": {
        "$ref": "inst/V/vmin.vx.yaml"
      },
      "vminu.vv": {
        "$ref": "inst/V/vminu.vv.yaml"
      },
      "vminu.vx": {
        "$ref": "inst/V/vminu.vx.yaml"
      },
      "vmnand.mm": {
        "$ref": "inst/V/vmnand.mm.yaml"
      },
      "vmnor.mm": {
        "$ref": "inst/V/vmnor.mm.yaml"
      },
      "vmor.mm": {
        "$ref": "inst/V/vmor.mm.yaml"
      },
      "vmorn.mm": {
        "$ref": "inst/V/vmorn.mm.yaml"
      },
      "vmsbc.vv": {
        "$ref": "inst/V/vmsbc.vv.yaml"
      },
      "vmsbc.vvm": {
        "$ref": "inst/V/vmsbc.vvm.yaml"
      },
      "vmsbc.vx": {
        "$ref": "inst/V/vmsbc.vx.yaml"
      },
      "vmsbc.vxm": {
        "$ref": "inst/V/vmsbc.vxm.yaml"
      },
      "vmsbf.m": {
        "$ref": "inst/V/vmsbf.m.yaml"
      },
      "vmseq.vi": {
        "$ref": "inst/V/vmseq.vi.yaml"
      },
      "vmseq.vv": {
        "$ref": "inst/V/vmseq.vv.yaml"
      },
      "vmseq.vx": {
        "$ref": "inst/V/vmseq.vx.yaml"
      },
      "vmsgt.vi": {
        "$ref": "inst/V/vmsgt.vi.yaml"
      },
      "vmsgt.vx": {
        "$ref": "inst/V/vmsgt.vx.yaml"
      },
      "vmsgtu.vi": {
        "$ref": "inst/V/vmsgtu.vi.yaml"
      },
      "vmsgtu.vx": {
        "$ref": "inst/V/vmsgtu.vx.yaml"
      },
      "vmsif.m": {
        "$ref": "inst/V/vmsif.m.yaml"
      },
      "vmsle.vi": {
        "$ref": "inst/V/vmsle.vi.yaml"
      },
      "vmsle.vv": {
        "$ref": "inst/V/vmsle.vv.yaml"
      },
      "vmsle.vx": {
        "$ref": "inst/V/vmsle.vx.yaml"
      },
      "vmsleu.vi": {
        "$ref": "inst/V/vmsleu.vi.yaml"
      },
      "vmsleu.vv": {
        "$ref": "inst/V/vmsleu.vv.yaml"
      },
      "vmsleu.vx": {
        "$ref": "inst/V/vmsleu.vx.yaml"
      },
      "vmslt.vv": {
        "$ref": "inst/V/vmslt.vv.yaml"
      },
      "vmslt.vx": {
        "$ref": "inst/V/vmslt.vx.yaml"
      },
      "vmsltu.vv": {
        "$ref": "inst/V/vmsltu.vv.yaml"
      },
      "vmsltu.vx": {
        "$ref": "inst/V/vmsltu.vx.yaml"
      },
      "vmsne.vi": {
        "$ref": "inst/V/vmsne.vi.yaml"
      },
      "vmsne.vv": {
        "$ref": "inst/V/vmsne.vv.yaml"
      },
      "vmsne.vx": {
        "$ref": "inst/V/vmsne.vx.yaml"
      },
      "vmsof.m": {
        "$ref": "inst/V/vmsof.m.yaml"
      },
      "vmul.vv": {
        "$ref": "inst/V/vmul.vv.yaml"
      },
      "vmul.vx": {
        "$ref": "inst/V/vmul.vx.yaml"
      },
      "vmulh.vv": {
        "$ref": "inst/V/vmulh.vv.yaml"
      },
      "vmulh.vx": {
        "$ref": "inst/V/vmulh.vx.yaml"
      },
      "vmulhsu.vv": {
        "$ref": "inst/V/vmulhsu.vv.yaml"
      },
      "vmulhsu.vx": {
        "$ref": "inst/V/vmulhsu.vx.yaml"
      },
      "vmulhu.vv": {
        "$ref": "inst/V/vmulhu.vv.yaml"
      },
      "vmulhu.vx": {
        "$ref": "inst/V/vmulhu.vx.yaml"
      },
      "vmv.s.x": {
        "$ref": "inst/V/vmv.s.x.yaml"
      },
      "vmv.v.i": {
        "$ref": "inst/V/vmv.v.i.yaml"
      },
      "vmv.v.v": {
        "$ref": "inst/V/vmv.v.v.yaml"
      },
      "vmv.v.x": {
        "$ref": "inst/V/vmv.v.x.yaml"
      },
      "vmv.x.s": {
        "$ref": "inst/V/vmv.x.s.yaml"
      },
      "vmv1r.v": {
        "$ref": "inst/V/vmv1r.v.yaml"
      },
      "vmv2r.v": {
        "$ref": "inst/V/vmv2r.v.yaml"
      },
      "vmv4r.v": {
        "$ref": "inst/V/vmv4r.v.yaml"
      },
      "vmv8r.v": {
        "$ref": "inst/V/vmv8r.v.yaml"
      },
      "vmxnor.mm": {
        "$ref": "inst/V/vmxnor.mm.yaml"
      },
      "vmxor.mm": {
        "$ref": "inst/V/vmxor.mm.yaml"
      },
      "vnclip.wi": {
        "$ref": "inst/V/vnclip.wi.yaml"
      },
      "vnclip.wv": {
        "$ref": "inst/V/vnclip.wv.yaml"
      },
      "vnclip.wx": {
        "$ref": "inst/V/vnclip.wx.yaml"
      },
      "vnclipu.wi": {
        "$ref": "inst/V/vnclipu.wi.yaml"
      },
      "vnclipu.wv": {
        "$ref": "inst/V/vnclipu.wv.yaml"
      },
      "vnclipu.wx": {
        "$ref": "inst/V/vnclipu.wx.yaml"
      },
      "vnmsac.vv": {
        "$ref": "inst/V/vnmsac.vv.yaml"
      },
      "vnmsac.vx": {
        "$ref": "inst/V/vnmsac.vx.yaml"
      },
      "vnmsub.vv": {
        "$ref": "inst/V/vnmsub.vv.yaml"
      },
      "vnmsub.vx": {
        "$ref": "inst/V/vnmsub.vx.yaml"
      },
      "vnsra.wi": {
        "$ref": "inst/V/vnsra.wi.yaml"
      },
      "vnsra.wv": {
        "$ref": "inst/V/vnsra.wv.yaml"
      },
      "vnsra.wx": {
        "$ref": "inst/V/vnsra.wx.yaml"
      },
      "vnsrl.wi": {
        "$ref": "inst/V/vnsrl.wi.yaml"
      },
      "vnsrl.wv": {
        "$ref": "inst/V/vnsrl.wv.yaml"
      },
      "vnsrl.wx": {
        "$ref": "inst/V/vnsrl.wx.yaml"
      },
      "vor.vi": {
        "$ref": "inst/V/vor.vi.yaml"
      },
      "vor.vv": {
        "$ref": "inst/V/vor.vv.yaml"
      },
      "vor.vx": {
        "$ref": "inst/V/vor.vx.yaml"
      },
      "vredand.vs": {
        "$ref": "inst/V/vredand.vs.yaml"
      },
      "vredmax.vs": {
        "$ref": "inst/V/vredmax.vs.yaml"
      },
      "vredmaxu.vs": {
        "$ref": "inst/V/vredmaxu.vs.yaml"
      },
      "vredmin.vs": {
        "$ref": "inst/V/vredmin.vs.yaml"
      },
      "vredminu.vs": {
        "$ref": "inst/V/vredminu.vs.yaml"
      },
      "vredor.vs": {
        "$ref": "inst/V/vredor.vs.yaml"
      },
      "vredsum.vs": {
        "$ref": "inst/V/vredsum.vs.yaml"
      },
      "vredxor.vs": {
        "$ref": "inst/V/vredxor.vs.yaml"
      },
      "vrem.vv": {
        "$ref": "inst/V/vrem.vv.yaml"
      },
      "vrem.vx": {
        "$ref": "inst/V/vrem.vx.yaml"
      },
      "vremu.vv": {
        "$ref": "inst/V/vremu.vv.yaml"
      },
      "vremu.vx": {
        "$ref": "inst/V/vremu.vx.yaml"
      },
      "vrgather.vi": {
        "$ref": "inst/V/vrgather.vi.yaml"
      },
      "vrgather.vv": {
        "$ref": "inst/V/vrgather.vv.yaml"
      },
      "vrgather.vx": {
        "$ref": "inst/V/vrgather.vx.yaml"
      },
      "vrgatherei16.vv": {
        "$ref": "inst/V/vrgatherei16.vv.yaml"
      },
      "vrsub.vi": {
        "$ref": "inst/V/vrsub.vi.yaml"
      },
      "vrsub.vx": {
        "$ref": "inst/V/vrsub.vx.yaml"
      },
      "vs1r.v": {
        "$ref": "inst/V/vs1r.v.yaml"
      },
      "vs2r.v": {
        "$ref": "inst/V/vs2r.v.yaml"
      },
      "vs4r.v": {
        "$ref": "inst/V/vs4r.v.yaml"
      },
      "vs8r.v": {
        "$ref": "inst/V/vs8r.v.yaml"
      },
      "vsadd.vi": {
        "$ref": "inst/V/vsadd.vi.yaml"
      },
      "vsadd.vv": {
        "$ref": "inst/V/vsadd.vv.yaml"
      },
      "vsadd.vx": {
        "$ref": "inst/V/vsadd.vx.yaml"
      },
      "vsaddu.vi": {
        "$ref": "inst/V/vsaddu.vi.yaml"
      },
      "vsaddu.vv": {
        "$ref": "inst/V/vsaddu.vv.yaml"
      },
      "vsaddu.vx": {
        "$ref": "inst/V/vsaddu.vx.yaml"
      },
      "vsbc.vvm": {
        "$ref": "inst/V/vsbc.vvm.yaml"
      },
      "vsbc.vxm": {
        "$ref": "inst/V/vsbc.vxm.yaml"
      },
      "vse16.v": {
        "$ref": "inst/V/vse16.v.yaml"
      },
      "vse32.v": {
        "$ref": "inst/V/vse32.v.yaml"
      },
      "vse64.v": {
        "$ref": "inst/V/vse64.v.yaml"
      },
      "vse8.v": {
        "$ref": "inst/V/vse8.v.yaml"
      },
      "vsetivli": {
        "$ref": "inst/V/vsetivli.yaml"
      },
      "vsetvl": {
        "$ref": "inst/V/vsetvl.yaml"
      },
      "vsetvli": {
        "$ref": "inst/V/vsetvli.yaml"
      },
      "vsext.vf2": {
        "$ref": "inst/V/vsext.vf2.yaml"
      },
      "vsext.vf4": {
        "$ref": "inst/V/vsext.vf4.yaml"
      },
      "vsext.vf8": {
        "$ref": "inst/V/vsext.vf8.yaml"
      },
      "vslide1down.vx": {
        "$ref": "inst/V/vslide1down.vx.yaml"
      },
      "vslide1up.vx": {
        "$ref": "inst/V/vslide1up.vx.yaml"
      },
      "vslidedown.vi": {
        "$ref": "inst/V/vslidedown.vi.yaml"
      },
      "vslidedown.vx": {
        "$ref": "inst/V/vslidedown.vx.yaml"
      },
      "vslideup.vi": {
        "$ref": "inst/V/vslideup.vi.yaml"
      },
      "vslideup.vx": {
        "$ref": "inst/V/vslideup.vx.yaml"
      },
      "vsll.vi": {
        "$ref": "inst/V/vsll.vi.yaml"
      },
      "vsll.vv": {
        "$ref": "inst/V/vsll.vv.yaml"
      },
      "vsll.vx": {
        "$ref": "inst/V/vsll.vx.yaml"
      },
      "vsm.v": {
        "$ref": "inst/V/vsm.v.yaml"
      },
      "vsmul.vv": {
        "$ref": "inst/V/vsmul.vv.yaml"
      },
      "vsmul.vx": {
        "$ref": "inst/V/vsmul.vx.yaml"
      },
      "vsoxei16.v": {
        "$ref": "inst/V/vsoxei16.v.yaml"
      },
      "vsoxei32.v": {
        "$ref": "inst/V/vsoxei32.v.yaml"
      },
      "vsoxei64.v": {
        "$ref": "inst/V/vsoxei64.v.yaml"
      },
      "vsoxei8.v": {
        "$ref": "inst/V/vsoxei8.v.yaml"
      },
      "vsoxseg2ei16.v": {
        "$ref": "inst/V/vsoxseg2ei16.v.yaml"
      },
      "vsoxseg2ei32.v": {
        "$ref": "inst/V/vsoxseg2ei32.v.yaml"
      },
      "vsoxseg2ei64.v": {
        "$ref": "inst/V/vsoxseg2ei64.v.yaml"
      },
      "vsoxseg2ei8.v": {
        "$ref": "inst/V/vsoxseg2ei8.v.yaml"
      },
      "vsoxseg3ei16.v": {
        "$ref": "inst/V/vsoxseg3ei16.v.yaml"
      },
      "vsoxseg3ei32.v": {
        "$ref": "inst/V/vsoxseg3ei32.v.yaml"
      },
      "vsoxseg3ei64.v": {
        "$ref": "inst/V/vsoxseg3ei64.v.yaml"
      },
      "vsoxseg3ei8.v": {
        "$ref": "inst/V/vsoxseg3ei8.v.yaml"
      },
      "vsoxseg4ei16.v": {
        "$ref": "inst/V/vsoxseg4ei16.v.yaml"
      },
      "vsoxseg4ei32.v": {
        "$ref": "inst/V/vsoxseg4ei32.v.yaml"
      },
      "vsoxseg4ei64.v": {
        "$ref": "inst/V/vsoxseg4ei64.v.yaml"
      },
      "vsoxseg4ei8.v": {
        "$ref": "inst/V/vsoxseg4ei8.v.yaml"
      },
      "vsoxseg5ei16.v": {
        "$ref": "inst/V/vsoxseg5ei16.v.yaml"
      },
      "vsoxseg5ei32.v": {
        "$ref": "inst/V/vsoxseg5ei32.v.yaml"
      },
      "vsoxseg5ei64.v": {
        "$ref": "inst/V/vsoxseg5ei64.v.yaml"
      },
      "vsoxseg5ei8.v": {
        "$ref": "inst/V/vsoxseg5ei8.v.yaml"
      },
      "vsoxseg6ei16.v": {
        "$ref": "inst/V/vsoxseg6ei16.v.yaml"
      },
      "vsoxseg6ei32.v": {
        "$ref": "inst/V/vsoxseg6ei32.v.yaml"
      },
      "vsoxseg6ei64.v": {
        "$ref": "inst/V/vsoxseg6ei64.v.yaml"
      },
      "vsoxseg6ei8.v": {
        "$ref": "inst/V/vsoxseg6ei8.v.yaml"
      },
      "vsoxseg7ei16.v": {
        "$ref": "inst/V/vsoxseg7ei16.v.yaml"
      },
      "vsoxseg7ei32.v": {
        "$ref": "inst/V/vsoxseg7ei32.v.yaml"
      },
      "vsoxseg7ei64.v": {
        "$ref": "inst/V/vsoxseg7ei64.v.yaml"
      },
      "vsoxseg7ei8.v": {
        "$ref": "inst/V/vsoxseg7ei8.v.yaml"
      },
      "vsoxseg8ei16.v": {
        "$ref": "inst/V/vsoxseg8ei16.v.yaml"
      },
      "vsoxseg8ei32.v": {
        "$ref": "inst/V/vsoxseg8ei32.v.yaml"
      },
      "vsoxseg8ei64.v": {
        "$ref": "inst/V/vsoxseg8ei64.v.yaml"
      },
      "vsoxseg8ei8.v": {
        "$ref": "inst/V/vsoxseg8ei8.v.yaml"
      },
      "vsra.vi": {
        "$ref": "inst/V/vsra.vi.yaml"
      },
      "vsra.vv": {
        "$ref": "inst/V/vsra.vv.yaml"
      },
      "vsra.vx": {
        "$ref": "inst/V/vsra.vx.yaml"
      },
      "vsrl.vi": {
        "$ref": "inst/V/vsrl.vi.yaml"
      },
      "vsrl.vv": {
        "$ref": "inst/V/vsrl.vv.yaml"
      },
      "vsrl.vx": {
        "$ref": "inst/V/vsrl.vx.yaml"
      },
      "vsse16.v": {
        "$ref": "inst/V/vsse16.v.yaml"
      },
      "vsse32.v": {
        "$ref": "inst/V/vsse32.v.yaml"
      },
      "vsse64.v": {
        "$ref": "inst/V/vsse64.v.yaml"
      },
      "vsse8.v": {
        "$ref": "inst/V/vsse8.v.yaml"
      },
      "vsseg2e16.v": {
        "$ref": "inst/V/vsseg2e16.v.yaml"
      },
      "vsseg2e32.v": {
        "$ref": "inst/V/vsseg2e32.v.yaml"
      },
      "vsseg2e64.v": {
        "$ref": "inst/V/vsseg2e64.v.yaml"
      },
      "vsseg2e8.v": {
        "$ref": "inst/V/vsseg2e8.v.yaml"
      },
      "vsseg3e16.v": {
        "$ref": "inst/V/vsseg3e16.v.yaml"
      },
      "vsseg3e32.v": {
        "$ref": "inst/V/vsseg3e32.v.yaml"
      },
      "vsseg3e64.v": {
        "$ref": "inst/V/vsseg3e64.v.yaml"
      },
      "vsseg3e8.v": {
        "$ref": "inst/V/vsseg3e8.v.yaml"
      },
      "vsseg4e16.v": {
        "$ref": "inst/V/vsseg4e16.v.yaml"
      },
      "vsseg4e32.v": {
        "$ref": "inst/V/vsseg4e32.v.yaml"
      },
      "vsseg4e64.v": {
        "$ref": "inst/V/vsseg4e64.v.yaml"
      },
      "vsseg4e8.v": {
        "$ref": "inst/V/vsseg4e8.v.yaml"
      },
      "vsseg5e16.v": {
        "$ref": "inst/V/vsseg5e16.v.yaml"
      },
      "vsseg5e32.v": {
        "$ref": "inst/V/vsseg5e32.v.yaml"
      },
      "vsseg5e64.v": {
        "$ref": "inst/V/vsseg5e64.v.yaml"
      },
      "vsseg5e8.v": {
        "$ref": "inst/V/vsseg5e8.v.yaml"
      },
      "vsseg6e16.v": {
        "$ref": "inst/V/vsseg6e16.v.yaml"
      },
      "vsseg6e32.v": {
        "$ref": "inst/V/vsseg6e32.v.yaml"
      },
      "vsseg6e64.v": {
        "$ref": "inst/V/vsseg6e64.v.yaml"
      },
      "vsseg6e8.v": {
        "$ref": "inst/V/vsseg6e8.v.yaml"
      },
      "vsseg7e16.v": {
        "$ref": "inst/V/vsseg7e16.v.yaml"
      },
      "vsseg7e32.v": {
        "$ref": "inst/V/vsseg7e32.v.yaml"
      },
      "vsseg7e64.v": {
        "$ref": "inst/V/vsseg7e64.v.yaml"
      },
      "vsseg7e8.v": {
        "$ref": "inst/V/vsseg7e8.v.yaml"
      },
      "vsseg8e16.v": {
        "$ref": "inst/V/vsseg8e16.v.yaml"
      },
      "vsseg8e32.v": {
        "$ref": "inst/V/vsseg8e32.v.yaml"
      },
      "vsseg8e64.v": {
        "$ref": "inst/V/vsseg8e64.v.yaml"
      },
      "vsseg8e8.v": {
        "$ref": "inst/V/vsseg8e8.v.yaml"
      },
      "vssra.vi": {
        "$ref": "inst/V/vssra.vi.yaml"
      },
      "vssra.vv": {
        "$ref": "inst/V/vssra.vv.yaml"
      },
      "vssra.vx": {
        "$ref": "inst/V/vssra.vx.yaml"
      },
      "vssrl.vi": {
        "$ref": "inst/V/vssrl.vi.yaml"
      },
      "vssrl.vv": {
        "$ref": "inst/V/vssrl.vv.yaml"
      },
      "vssrl.vx": {
        "$ref": "inst/V/vssrl.vx.yaml"
      },
      "vssseg2e16.v": {
        "$ref": "inst/V/vssseg2e16.v.yaml"
      },
      "vssseg2e32.v": {
        "$ref": "inst/V/vssseg2e32.v.yaml"
      },
      "vssseg2e64.v": {
        "$ref": "inst/V/vssseg2e64.v.yaml"
      },
      "vssseg2e8.v": {
        "$ref": "inst/V/vssseg2e8.v.yaml"
      },
      "vssseg3e16.v": {
        "$ref": "inst/V/vssseg3e16.v.yaml"
      },
      "vssseg3e32.v": {
        "$ref": "inst/V/vssseg3e32.v.yaml"
      },
      "vssseg3e64.v": {
        "$ref": "inst/V/vssseg3e64.v.yaml"
      },
      "vssseg3e8.v": {
        "$ref": "inst/V/vssseg3e8.v.yaml"
      },
      "vssseg4e16.v": {
        "$ref": "inst/V/vssseg4e16.v.yaml"
      },
      "vssseg4e32.v": {
        "$ref": "inst/V/vssseg4e32.v.yaml"
      },
      "vssseg4e64.v": {
        "$ref": "inst/V/vssseg4e64.v.yaml"
      },
      "vssseg4e8.v": {
        "$ref": "inst/V/vssseg4e8.v.yaml"
      },
      "vssseg5e16.v": {
        "$ref": "inst/V/vssseg5e16.v.yaml"
      },
      "vssseg5e32.v": {
        "$ref": "inst/V/vssseg5e32.v.yaml"
      },
      "vssseg5e64.v": {
        "$ref": "inst/V/vssseg5e64.v.yaml"
      },
      "vssseg5e8.v": {
        "$ref": "inst/V/vssseg5e8.v.yaml"
      },
      "vssseg6e16.v": {
        "$ref": "inst/V/vssseg6e16.v.yaml"
      },
      "vssseg6e32.v": {
        "$ref": "inst/V/vssseg6e32.v.yaml"
      },
      "vssseg6e64.v": {
        "$ref": "inst/V/vssseg6e64.v.yaml"
      },
      "vssseg6e8.v": {
        "$ref": "inst/V/vssseg6e8.v.yaml"
      },
      "vssseg7e16.v": {
        "$ref": "inst/V/vssseg7e16.v.yaml"
      },
      "vssseg7e32.v": {
        "$ref": "inst/V/vssseg7e32.v.yaml"
      },
      "vssseg7e64.v": {
        "$ref": "inst/V/vssseg7e64.v.yaml"
      },
      "vssseg7e8.v": {
        "$ref": "inst/V/vssseg7e8.v.yaml"
      },
      "vssseg8e16.v": {
        "$ref": "inst/V/vssseg8e16.v.yaml"
      },
      "vssseg8e32.v": {
        "$ref": "inst/V/vssseg8e32.v.yaml"
      },
      "vssseg8e64.v": {
        "$ref": "inst/V/vssseg8e64.v.yaml"
      },
      "vssseg8e8.v": {
        "$ref": "inst/V/vssseg8e8.v.yaml"
      },
      "vssub.vv": {
        "$ref": "inst/V/vssub.vv.yaml"
      },
      "vssub.vx": {
        "$ref": "inst/V/vssub.vx.yaml"
      },
      "vssubu.vv": {
        "$ref": "inst/V/vssubu.vv.yaml"
      },
      "vssubu.vx": {
        "$ref": "inst/V/vssubu.vx.yaml"
      },
      "vsub.vv": {
        "$ref": "inst/V/vsub.vv.yaml"
      },
      "vsub.vx": {
        "$ref": "inst/V/vsub.vx.yaml"
      },
      "vsuxei16.v": {
        "$ref": "inst/V/vsuxei16.v.yaml"
      },
      "vsuxei32.v": {
        "$ref": "inst/V/vsuxei32.v.yaml"
      },
      "vsuxei64.v": {
        "$ref": "inst/V/vsuxei64.v.yaml"
      },
      "vsuxei8.v": {
        "$ref": "inst/V/vsuxei8.v.yaml"
      },
      "vsuxseg2ei16.v": {
        "$ref": "inst/V/vsuxseg2ei16.v.yaml"
      },
      "vsuxseg2ei32.v": {
        "$ref": "inst/V/vsuxseg2ei32.v.yaml"
      },
      "vsuxseg2ei64.v": {
        "$ref": "inst/V/vsuxseg2ei64.v.yaml"
      },
      "vsuxseg2ei8.v": {
        "$ref": "inst/V/vsuxseg2ei8.v.yaml"
      },
      "vsuxseg3ei16.v": {
        "$ref": "inst/V/vsuxseg3ei16.v.yaml"
      },
      "vsuxseg3ei32.v": {
        "$ref": "inst/V/vsuxseg3ei32.v.yaml"
      },
      "vsuxseg3ei64.v": {
        "$ref": "inst/V/vsuxseg3ei64.v.yaml"
      },
      "vsuxseg3ei8.v": {
        "$ref": "inst/V/vsuxseg3ei8.v.yaml"
      },
      "vsuxseg4ei16.v": {
        "$ref": "inst/V/vsuxseg4ei16.v.yaml"
      },
      "vsuxseg4ei32.v": {
        "$ref": "inst/V/vsuxseg4ei32.v.yaml"
      },
      "vsuxseg4ei64.v": {
        "$ref": "inst/V/vsuxseg4ei64.v.yaml"
      },
      "vsuxseg4ei8.v": {
        "$ref": "inst/V/vsuxseg4ei8.v.yaml"
      },
      "vsuxseg5ei16.v": {
        "$ref": "inst/V/vsuxseg5ei16.v.yaml"
      },
      "vsuxseg5ei32.v": {
        "$ref": "inst/V/vsuxseg5ei32.v.yaml"
      },
      "vsuxseg5ei64.v": {
        "$ref": "inst/V/vsuxseg5ei64.v.yaml"
      },
      "vsuxseg5ei8.v": {
        "$ref": "inst/V/vsuxseg5ei8.v.yaml"
      },
      "vsuxseg6ei16.v": {
        "$ref": "inst/V/vsuxseg6ei16.v.yaml"
      },
      "vsuxseg6ei32.v": {
        "$ref": "inst/V/vsuxseg6ei32.v.yaml"
      },
      "vsuxseg6ei64.v": {
        "$ref": "inst/V/vsuxseg6ei64.v.yaml"
      },
      "vsuxseg6ei8.v": {
        "$ref": "inst/V/vsuxseg6ei8.v.yaml"
      },
      "vsuxseg7ei16.v": {
        "$ref": "inst/V/vsuxseg7ei16.v.yaml"
      },
      "vsuxseg7ei32.v": {
        "$ref": "inst/V/vsuxseg7ei32.v.yaml"
      },
      "vsuxseg7ei64.v": {
        "$ref": "inst/V/vsuxseg7ei64.v.yaml"
      },
      "vsuxseg7ei8.v": {
        "$ref": "inst/V/vsuxseg7ei8.v.yaml"
      },
      "vsuxseg8ei16.v": {
        "$ref": "inst/V/vsuxseg8ei16.v.yaml"
      },
      "vsuxseg8ei32.v": {
        "$ref": "inst/V/vsuxseg8ei32.v.yaml"
      },
      "vsuxseg8ei64.v": {
        "$ref": "inst/V/vsuxseg8ei64.v.yaml"
      },
      "vsuxseg8ei8.v": {
        "$ref": "inst/V/vsuxseg8ei8.v.yaml"
      },
      "vwadd.vv": {
        "$ref": "inst/V/vwadd.vv.yaml"
      },
      "vwadd.vx": {
        "$ref": "inst/V/vwadd.vx.yaml"
      },
      "vwadd.wv": {
        "$ref": "inst/V/vwadd.wv.yaml"
      },
      "vwadd.wx": {
        "$ref": "inst/V/vwadd.wx.yaml"
      },
      "vwaddu.vv": {
        "$ref": "inst/V/vwaddu.vv.yaml"
      },
      "vwaddu.vx": {
        "$ref": "inst/V/vwaddu.vx.yaml"
      },
      "vwaddu.wv": {
        "$ref": "inst/V/vwaddu.wv.yaml"
      },
      "vwaddu.wx": {
        "$ref": "inst/V/vwaddu.wx.yaml"
      },
      "vwmacc.vv": {
        "$ref": "inst/V/vwmacc.vv.yaml"
      },
      "vwmacc.vx": {
        "$ref": "inst/V/vwmacc.vx.yaml"
      },
      "vwmaccsu.vv": {
        "$ref": "inst/V/vwmaccsu.vv.yaml"
      },
      "vwmaccsu.vx": {
        "$ref": "inst/V/vwmaccsu.vx.yaml"
      },
      "vwmaccu.vv": {
        "$ref": "inst/V/vwmaccu.vv.yaml"
      },
      "vwmaccu.vx": {
        "$ref": "inst/V/vwmaccu.vx.yaml"
      },
      "vwmaccus.vx": {
        "$ref": "inst/V/vwmaccus.vx.yaml"
      },
      "vwmul.vv": {
        "$ref": "inst/V/vwmul.vv.yaml"
      },
      "vwmul.vx": {
        "$ref": "inst/V/vwmul.vx.yaml"
      },
      "vwmulsu.vv": {
        "$ref": "inst/V/vwmulsu.vv.yaml"
      },
      "vwmulsu.vx": {
        "$ref": "inst/V/vwmulsu.vx.yaml"
      },
      "vwmulu.vv": {
        "$ref": "inst/V/vwmulu.vv.yaml"
      },
      "vwmulu.vx": {
        "$ref": "inst/V/vwmulu.vx.yaml"
      },
      "vwredsum.vs": {
        "$ref": "inst/V/vwredsum.vs.yaml"
      },
      "vwredsumu.vs": {
        "$ref": "inst/V/vwredsumu.vs.yaml"
      },
      "vwsub.vv": {
        "$ref": "inst/V/vwsub.vv.yaml"
      },
      "vwsub.vx": {
        "$ref": "inst/V/vwsub.vx.yaml"
      },
      "vwsub.wv": {
        "$ref": "inst/V/vwsub.wv.yaml"
      },
      "vwsub.wx": {
        "$ref": "inst/V/vwsub.wx.yaml"
      },
      "vwsubu.vv": {
        "$ref": "inst/V/vwsubu.vv.yaml"
      },
      "vwsubu.vx": {
        "$ref": "inst/V/vwsubu.vx.yaml"
      },
      "vwsubu.wv": {
        "$ref": "inst/V/vwsubu.wv.yaml"
      },
      "vwsubu.wx": {
        "$ref": "inst/V/vwsubu.wx.yaml"
      },
      "vxor.vi": {
        "$ref": "inst/V/vxor.vi.yaml"
      },
      "vxor.vv": {
        "$ref": "inst/V/vxor.vv.yaml"
      },
      "vxor.vx": {
        "$ref": "inst/V/vxor.vx.yaml"
      },
      "vzext.vf2": {
        "$ref": "inst/V/vzext.vf2.yaml"
      },
      "vzext.vf4": {
        "$ref": "inst/V/vzext.vf4.yaml"
      },
      "vzext.vf8": {
        "$ref": "inst/V/vzext.vf8.yaml"
      }
    },
    "Zabha": {
      "amoadd.b": {
        "$ref": "inst/Zabha/amoadd.b.yaml"
      },
      "amoadd.h": {
        "$ref": "inst/Zabha/amoadd.h.yaml"
      },
      "amoand.b": {
        "$ref": "inst/Zabha/amoand.b.yaml"
      },
      "amoand.h": {
        "$ref": "inst/Zabha/amoand.h.yaml"
      },
      "amocas.b": {
        "$ref": "inst/Zabha/amocas.b.yaml"
      },
      "amocas.h": {
        "$ref": "inst/Zabha/amocas.h.yaml"
      },
      "amomax.b": {
        "$ref": "inst/Zabha/amomax.b.yaml"
      },
      "amomax.h": {
        "$ref": "inst/Zabha/amomax.h.yaml"
      },
      "amomaxu.b": {
        "$ref": "inst/Zabha/amomaxu.b.yaml"
      },
      "amomaxu.h": {
        "$ref": "inst/Zabha/amomaxu.h.yaml"
      },
      "amomin.b": {
        "$ref": "inst/Zabha/amomin.b.yaml"
      },
      "amomin.h": {
        "$ref": "inst/Zabha/amomin.h.yaml"
      },
      "amominu.b": {
        "$ref": "inst/Zabha/amominu.b.yaml"
      },
      "amominu.h": {
        "$ref": "inst/Zabha/amominu.h.yaml"
      },
      "amoor.b": {
        "$ref": "inst/Zabha/amoor.b.yaml"
      },
      "amoor.h": {
        "$ref": "inst/Zabha/amoor.h.yaml"
      },
      "amoswap.b": {
        "$ref": "inst/Zabha/amoswap.b.yaml"
      },
      "amoswap.h": {
        "$ref": "inst/Zabha/amoswap.h.yaml"
      },
      "amoxor.b": {
        "$ref": "inst/Zabha/amoxor.b.yaml"
      },
      "amoxor.h": {
        "$ref": "inst/Zabha/amoxor.h.yaml"
      }
    },
    "Zacas": {
      "amocas.d": {
        "$ref": "inst/Zacas/amocas.d.yaml"
      },
      "amocas.q": {
        "$ref": "inst/Zacas/amocas.q.yaml"
      },
      "amocas.w": {
        "$ref": "inst/Zacas/amocas.w.yaml"
      }
    },
    "Zalasr": {
      "lb.aq": {
        "$ref": "inst/Zalasr/lb.aq.yaml"
      },
      "ld.aq": {
        "$ref": "inst/Zalasr/ld.aq.yaml"
      },
      "lh.aq": {
        "$ref": "inst/Zalasr/lh.aq.yaml"
      },
      "lw.aq": {
        "$ref": "inst/Zalasr/lw.aq.yaml"
      },
      "sb.rl": {
        "$ref": "inst/Zalasr/sb.rl.yaml"
      },
      "sd.rl": {
        "$ref": "inst/Zalasr/sd.rl.yaml"
      },
      "sh.rl": {
        "$ref": "inst/Zalasr/sh.rl.yaml"
      },
      "sw.rl": {
        "$ref": "inst/Zalasr/sw.rl.yaml"
      }
    },
    "Zawrs": {
      "wrs.nto": {
        "$ref": "inst/Zawrs/wrs.nto.yaml"
      },
      "wrs.sto": {
        "$ref": "inst/Zawrs/wrs.sto.yaml"
      }
    },
    "Zbkb": {
      "brev8": {
        "$ref": "inst/Zbkb/brev8.yaml"
      },
      "unzip": {
        "$ref": "inst/Zbkb/unzip.yaml"
      },
      "zip": {
        "$ref": "inst/Zbkb/zip.yaml"
      }
    },
    "Zbkx": {
      "xperm4": {
        "$ref": "inst/Zbkx/xperm4.yaml"
      },
      "xperm8": {
        "$ref": "inst/Zbkx/xperm8.yaml"
      }
    },
    "Zcb": {
      "c.lbu": {
        "$ref": "inst/Zcb/c.lbu.yaml"
      },
      "c.lh": {
        "$ref": "inst/Zcb/c.lh.yaml"
      },
      "c.lhu": {
        "$ref": "inst/Zcb/c.lhu.yaml"
      },
      "c.mul": {
        "$ref": "inst/Zcb/c.mul.yaml"
      },
      "c.not": {
        "$ref": "inst/Zcb/c.not.yaml"
      },
      "c.sb": {
        "$ref": "inst/Zcb/c.sb.yaml"
      },
      "c.sext.b": {
        "$ref": "inst/Zcb/c.sext.b.yaml"
      },
      "c.sext.h": {
        "$ref": "inst/Zcb/c.sext.h.yaml"
      },
      "c.sh": {
        "$ref": "inst/Zcb/c.sh.yaml"
      },
      "c.zext.b": {
        "$ref": "inst/Zcb/c.zext.b.yaml"
      },
      "c.zext.h": {
        "$ref": "inst/Zcb/c.zext.h.yaml"
      },
      "c.zext.w": {
        "$ref": "inst/Zcb/c.zext.w.yaml"
      }
    },
    "Zcmp": {
      "cm.mva01s": {
        "$ref": "inst/Zcmp/cm.mva01s.yaml"
      },
      "cm.mvsa01": {
        "$ref": "inst/Zcmp/cm.mvsa01.yaml"
      },
      "cm.pop": {
        "$ref": "inst/Zcmp/cm.pop.yaml"
      },
      "cm.popret": {
        "$ref": "inst/Zcmp/cm.popret.yaml"
      },
      "cm.popretz": {
        "$ref": "inst/Zcmp/cm.popretz.yaml"
      },
      "cm.push": {
        "$ref": "inst/Zcmp/cm.push.yaml"
      }
    },
    "Zfbfmin": {
      "fcvt.bf16.s": {
        "$ref": "inst/Zfbfmin/fcvt.bf16.s.yaml"
      },
      "fcvt.s.bf16": {
        "$ref": "inst/Zfbfmin/fcvt.s.bf16.yaml"
      }
    },
    "Zfh": {
      "fadd.h": {
        "$ref": "inst/Zfh/fadd.h.yaml"
      },
      "fclass.h": {
        "$ref": "inst/Zfh/fclass.h.yaml"
      },
      "fcvt.d.h": {
        "$ref": "inst/Zfh/fcvt.d.h.yaml"
      },
      "fcvt.h.d": {
        "$ref": "inst/Zfh/fcvt.h.d.yaml"
      },
      "fcvt.h.l": {
        "$ref": "inst/Zfh/fcvt.h.l.yaml"
      },
      "fcvt.h.lu": {
        "$ref": "inst/Zfh/fcvt.h.lu.yaml"
      },
      "fcvt.h.s": {
        "$ref": "inst/Zfh/fcvt.h.s.yaml"
      },
      "fcvt.h.w": {
        "$ref": "inst/Zfh/fcvt.h.w.yaml"
      },
      "fcvt.h.wu": {
        "$ref": "inst/Zfh/fcvt.h.wu.yaml"
      },
      "fcvt.l.h": {
        "$ref": "inst/Zfh/fcvt.l.h.yaml"
      },
      "fcvt.lu.h": {
        "$ref": "inst/Zfh/fcvt.lu.h.yaml"
      },
      "fcvt.s.h": {
        "$ref": "inst/Zfh/fcvt.s.h.yaml"
      },
      "fcvt.w.h": {
        "$ref": "inst/Zfh/fcvt.w.h.yaml"
      },
      "fcvt.wu.h": {
        "$ref": "inst/Zfh/fcvt.wu.h.yaml"
      },
      "fdiv.h": {
        "$ref": "inst/Zfh/fdiv.h.yaml"
      },
      "feq.h": {
        "$ref": "inst/Zfh/feq.h.yaml"
      },
      "fle.h": {
        "$ref": "inst/Zfh/fle.h.yaml"
      },
      "fleq.h": {
        "$ref": "inst/Zfh/fleq.h.yaml"
      },
      "flh": {
        "$ref": "inst/Zfh/flh.yaml"
      },
      "fli.h": {
        "$ref": "inst/Zfh/fli.h.yaml"
      },
      "flt.h": {
        "$ref": "inst/Zfh/flt.h.yaml"
      },
      "fltq.h": {
        "$ref": "inst/Zfh/fltq.h.yaml"
      },
      "fmadd.h": {
        "$ref": "inst/Zfh/fmadd.h.yaml"
      },
      "fmax.h": {
        "$ref": "inst/Zfh/fmax.h.yaml"
      },
      "fmaxm.h": {
        "$ref": "inst/Zfh/fmaxm.h.yaml"
      },
      "fmin.h": {
        "$ref": "inst/Zfh/fmin.h.yaml"
      },
      "fminm.h": {
        "$ref": "inst/Zfh/fminm.h.yaml"
      },
      "fmsub.h": {
        "$ref": "inst/Zfh/fmsub.h.yaml"
      },
      "fmul.h": {
        "$ref": "inst/Zfh/fmul.h.yaml"
      },
      "fmv.h.x": {
        "$ref": "inst/Zfh/fmv.h.x.yaml"
      },
      "fmv.x.h": {
        "$ref": "inst/Zfh/fmv.x.h.yaml"
      },
      "fnmadd.h": {
        "$ref": "inst/Zfh/fnmadd.h.yaml"
      },
      "fnmsub.h": {
        "$ref": "inst/Zfh/fnmsub.h.yaml"
      },
      "fround.h": {
        "$ref": "inst/Zfh/fround.h.yaml"
      },
      "froundnx.h": {
        "$ref": "inst/Zfh/froundnx.h.yaml"
      },
      "fsgnj.h": {
        "$ref": "inst/Zfh/fsgnj.h.yaml"
      },
      "fsgnjn.h": {
        "$ref": "inst/Zfh/fsgnjn.h.yaml"
      },
      "fsgnjx.h": {
        "$ref": "inst/Zfh/fsgnjx.h.yaml"
      },
      "fsh": {
        "$ref": "inst/Zfh/fsh.yaml"
      },
      "fsqrt.h": {
        "$ref": "inst/Zfh/fsqrt.h.yaml"
      },
      "fsub.h": {
        "$ref": "inst/Zfh/fsub.h.yaml"
      }
    },
    "Zicbom": {
      "cbo.clean": {
        "$ref": "inst/Zicbom/cbo.clean.yaml"
      },
      "cbo.flush": {
        "$ref": "inst/Zicbom/cbo.flush.yaml"
      },
      "cbo.inval": {
        "$ref": "inst/Zicbom/cbo.inval.yaml"
      }
    },
    "Zicboz": {
      "cbo.zero": {
        "$ref": "inst/Zicboz/cbo.zero.yaml"
      }
    },
    "Zicfilp": {
      "lpad": {
        "$ref": "inst/Zicfilp/lpad.yaml"
      }
    },
    "Zicfiss": {
      "ssamoswap.d": {
        "$ref": "inst/Zicfiss/ssamoswap.d.yaml"
      },
      "ssamoswap.w": {
        "$ref": "inst/Zicfiss/ssamoswap.w.yaml"
      },
      "sspopchk.x1": {
        "$ref": "inst/Zicfiss/sspopchk.x1.yaml"
      },
      "sspopchk.x5": {
        "$ref": "inst/Zicfiss/sspopchk.x5.yaml"
      },
      "sspush.x1": {
        "$ref": "inst/Zicfiss/sspush.x1.yaml"
      },
      "sspush.x5": {
        "$ref": "inst/Zicfiss/sspush.x5.yaml"
      },
      "ssrdp": {
        "$ref": "inst/Zicfiss/ssrdp.yaml"
      }
    },
    "Zicond": {
      "czero.eqz": {
        "$ref": "inst/Zicond/czero.eqz.yaml"
      },
      "czero.nez": {
        "$ref": "inst/Zicond/czero.nez.yaml"
      }
    },
    "Zicsr": {
      "csrrc": {
        "$ref": "inst/Zicsr/csrrc.yaml"
      },
      "csrrci": {
        "$ref": "inst/Zicsr/csrrci.yaml"
      },
      "csrrs": {
        "$ref": "inst/Zicsr/csrrs.yaml"
      },
      "csrrsi": {
        "$ref": "inst/Zicsr/csrrsi.yaml"
      },
      "csrrw": {
        "$ref": "inst/Zicsr/csrrw.yaml"
      },
      "csrrwi": {
        "$ref": "inst/Zicsr/csrrwi.yaml"
      }
    },
    "Zifencei": {
      "fence.i": {
        "$ref": "inst/Zifencei/fence.i.yaml"
      }
    },
    "Zimop": {
      "mop.r.n": {
        "$ref": "inst/Zimop/mop.r.n.yaml"
      },
      "mop.rr.n": {
        "$ref": "inst/Zimop/mop.rr.n.yaml"
      }
    },
    "Zk": {
      "aes32dsi": {
        "$ref": "inst/Zk/aes32dsi.yaml"
      },
      "aes32dsmi": {
        "$ref": "inst/Zk/aes32dsmi.yaml"
      },
      "aes32esi": {
        "$ref": "inst/Zk/aes32esi.yaml"
      },
      "aes32esmi": {
        "$ref": "inst/Zk/aes32esmi.yaml"
      },
      "aes64ds": {
        "$ref": "inst/Zk/aes64ds.yaml"
      },
      "aes64dsm": {
        "$ref": "inst/Zk/aes64dsm.yaml"
      },
      "aes64es": {
        "$ref": "inst/Zk/aes64es.yaml"
      },
      "aes64esm": {
        "$ref": "inst/Zk/aes64esm.yaml"
      },
      "aes64im": {
        "$ref": "inst/Zk/aes64im.yaml"
      },
      "aes64ks1i": {
        "$ref": "inst/Zk/aes64ks1i.yaml"
      },
      "aes64ks2": {
        "$ref": "inst/Zk/aes64ks2.yaml"
      },
      "pack": {
        "$ref": "inst/Zk/pack.yaml"
      },
      "packh": {
        "$ref": "inst/Zk/packh.yaml"
      },
      "packw": {
        "$ref": "inst/Zk/packw.yaml"
      },
      "sha256sig0": {
        "$ref": "inst/Zk/sha256sig0.yaml"
      },
      "sha256sig1": {
        "$ref": "inst/Zk/sha256sig1.yaml"
      },
      "sha256sum0": {
        "$ref": "inst/Zk/sha256sum0.yaml"
      },
      "sha256sum1": {
        "$ref": "inst/Zk/sha256sum1.yaml"
      },
      "sha512sig0": {
        "$ref": "inst/Zk/sha512sig0.yaml"
      },
      "sha512sig0h": {
        "$ref": "inst/Zk/sha512sig0h.yaml"
      },
      "sha512sig0l": {
        "$ref": "inst/Zk/sha512sig0l.yaml"
      },
      "sha512sig1": {
        "$ref": "inst/Zk/sha512sig1.yaml"
      },
      "sha512sig1h": {
        "$ref": "inst/Zk/sha512sig1h.yaml"
      },
      "sha512sig1l": {
        "$ref": "inst/Zk/sha512sig1l.yaml"
      },
      "sha512sum0": {
        "$ref": "inst/Zk/sha512sum0.yaml"
      },
      "sha512sum0r": {
        "$ref": "inst/Zk/sha512sum0r.yaml"
      },
      "sha512sum1": {
        "$ref": "inst/Zk/sha512sum1.yaml"
      },
      "sha512sum1r": {
        "$ref": "inst/Zk/sha512sum1r.yaml"
      }
    },
    "Zks": {
      "sm3p0": {
        "$ref": "inst/Zks/sm3p0.yaml"
      },
      "sm3p1": {
        "$ref": "inst/Zks/sm3p1.yaml"
      },
      "sm4ed": {
        "$ref": "inst/Zks/sm4ed.yaml"
      },
      "sm4ks": {
        "$ref": "inst/Zks/sm4ks.yaml"
      }
    },
    "Zvbb": {
      "vandn.vv": {
        "$ref": "inst/Zvbb/vandn.vv.yaml"
      },
      "vandn.vx": {
        "$ref": "inst/Zvbb/vandn.vx.yaml"
      },
      "vbrev.v": {
        "$ref": "inst/Zvbb/vbrev.v.yaml"
      },
      "vbrev8.v": {
        "$ref": "inst/Zvbb/vbrev8.v.yaml"
      },
      "vclz.v": {
        "$ref": "inst/Zvbb/vclz.v.yaml"
      },
      "vcpop.v": {
        "$ref": "inst/Zvbb/vcpop.v.yaml"
      },
      "vctz.v": {
        "$ref": "inst/Zvbb/vctz.v.yaml"
      },
      "vrev8.v": {
        "$ref": "inst/Zvbb/vrev8.v.yaml"
      },
      "vrol.vv": {
        "$ref": "inst/Zvbb/vrol.vv.yaml"
      },
      "vrol.vx": {
        "$ref": "inst/Zvbb/vrol.vx.yaml"
      },
      "vror.vi": {
        "$ref": "inst/Zvbb/vror.vi.yaml"
      },
      "vror.vv": {
        "$ref": "inst/Zvbb/vror.vv.yaml"
      },
      "vror.vx": {
        "$ref": "inst/Zvbb/vror.vx.yaml"
      },
      "vwsll.vi": {
        "$ref": "inst/Zvbb/vwsll.vi.yaml"
      },
      "vwsll.vv": {
        "$ref": "inst/Zvbb/vwsll.vv.yaml"
      },
      "vwsll.vx": {
        "$ref": "inst/Zvbb/vwsll.vx.yaml"
      }
    },
    "Zvbc": {
      "vclmul.vv": {
        "$ref": "inst/Zvbc/vclmul.vv.yaml"
      },
      "vclmul.vx": {
        "$ref": "inst/Zvbc/vclmul.vx.yaml"
      },
      "vclmulh.vv": {
        "$ref": "inst/Zvbc/vclmulh.vv.yaml"
      },
      "vclmulh.vx": {
        "$ref": "inst/Zvbc/vclmulh.vx.yaml"
      }
    },
    "Zvfbfmin": {
      "vfncvtbf16.f.f.w": {
        "$ref": "inst/Zvfbfmin/vfncvtbf16.f.f.w.yaml"
      },
      "vfwcvtbf16.f.f.v": {
        "$ref": "inst/Zvfbfmin/vfwcvtbf16.f.f.v.yaml"
      }
    },
    "Zvfbfwma": {
      "vfwmaccbf16.vf": {
        "$ref": "inst/Zvfbfwma/vfwmaccbf16.vf.yaml"
      },
      "vfwmaccbf16.vv": {
        "$ref": "inst/Zvfbfwma/vfwmaccbf16.vv.yaml"
      }
    },
    "Zvkg": {
      "vghsh.vv": {
        "$ref": "inst/Zvkg/vghsh.vv.yaml"
      },
      "vgmul.vv": {
        "$ref": "inst/Zvkg/vgmul.vv.yaml"
      }
    },
    "Zvkn": {
      "vaesdf.vs": {
        "$ref": "inst/Zvkn/vaesdf.vs.yaml"
      },
      "vaesdf.vv": {
        "$ref": "inst/Zvkn/vaesdf.vv.yaml"
      },
      "vaesdm.vs": {
        "$ref": "inst/Zvkn/vaesdm.vs.yaml"
      },
      "vaesdm.vv": {
        "$ref": "inst/Zvkn/vaesdm.vv.yaml"
      },
      "vaesef.vs": {
        "$ref": "inst/Zvkn/vaesef.vs.yaml"
      },
      "vaesef.vv": {
        "$ref": "inst/Zvkn/vaesef.vv.yaml"
      },
      "vaesem.vs": {
        "$ref": "inst/Zvkn/vaesem.vs.yaml"
      },
      "vaesem.vv": {
        "$ref": "inst/Zvkn/vaesem.vv.yaml"
      },
      "vaeskf1.vi": {
        "$ref": "inst/Zvkn/vaeskf1.vi.yaml"
      },
      "vaeskf2.vi": {
        "$ref": "inst/Zvkn/vaeskf2.vi.yaml"
      },
      "vaesz.vs": {
        "$ref": "inst/Zvkn/vaesz.vs.yaml"
      },
      "vsha2ch.vv": {
        "$ref": "inst/Zvkn/vsha2ch.vv.yaml"
      },
      "vsha2cl.vv": {
        "$ref": "inst/Zvkn/vsha2cl.vv.yaml"
      },
      "vsha2ms.vv": {
        "$ref": "inst/Zvkn/vsha2ms.vv.yaml"
      }
    },
    "Zvks": {
      "vsm3c.vi": {
        "$ref": "inst/Zvks/vsm3c.vi.yaml"
      },
      "vsm3me.vv": {
        "$ref": "inst/Zvks/vsm3me.vv.yaml"
      },
      "vsm4k.vi": {
        "$ref": "inst/Zvks/vsm4k.vi.yaml"
      },
      "vsm4r.vs": {
        "$ref": "inst/Zvks/vsm4r.vs.yaml"
      },
      "vsm4r.vv": {
        "$ref": "inst/Zvks/vsm4r.vv.yaml"
      }
    }
  },
  "isa": {},
  "manual": {
    "isa": {
      "$ref": "manual/isa.yaml"
    }
  },
  "manual_version": {
    "isa": {
      "20240411": {
        "isa_20240411": {
          "$ref": "manual_version/isa/20240411/isa_20240411.yaml"
        }
      }
    }
  },
  "profile": {
    "MP-S-64": {
      "$ref": "profile/MP-S-64.yaml"
    },
    "MP-U-64": {
      "$ref": "profile/MP-U-64.yaml"
    },
    "RVA20S64": {
      "$ref": "profile/RVA20S64.yaml"
    },
    "RVA20U64": {
      "$ref": "profile/RVA20U64.yaml"
    },
    "RVA22S64": {
      "$ref": "profile/RVA22S64.yaml"
    },
    "RVA22U64": {
      "$ref": "profile/RVA22U64.yaml"
    },
    "RVA23S64": {
      "$ref": "profile/RVA23S64.yaml"
    },
    "RVA23U64": {
      "$ref": "profile/RVA23U64.yaml"
    },
    "RVB23S64": {
      "$ref": "profile/RVB23S64.yaml"
    },
    "RVB23U64": {
      "$ref": "profile/RVB23U64.yaml"
    },
    "RVI20U32": {
      "$ref": "profile/RVI20U32.yaml"
    },
    "RVI20U64": {
      "$ref": "profile/RVI20U64.yaml"
    }
  },
  "profile_class": {
    "MockProfileClass": {
      "$ref": "profile_class/MockProfileClass.yaml"
    },
    "RVA": {
      "$ref": "profile_class/RVA.yaml"
    },
    "RVB": {
      "$ref": "profile_class/RVB.yaml"
    },
    "RVI": {
      "$ref": "profile_class/RVI.yaml"
    }
  },
  "profile_release": {
    "MockProfileRelease": {
      "$ref": "profile_release/MockProfileRelease.yaml"
    },
    "RVA20": {
      "$ref": "profile_release/RVA20.yaml"
    },
    "RVA22": {
      "$ref": "profile_release/RVA22.yaml"
    },
    "RVA23": {
      "$ref": "profile_release/RVA23.yaml"
    },
    "RVB23": {
      "$ref": "profile_release/RVB23.yaml"
    },
    "RVI20": {
      "$ref": "profile_release/RVI20.yaml"
    }
  },
  "prose": {}
}

},{}],3:[function(require,module,exports){
'use strict';

const rvvTraits = [
  {ch: '32.7',    m: /^v(?<a>[ls])\w+(?<b>.v)$/,                  desc: 'Vector Loads and Stores'},
  {ch: '32.7.4',  m: /^v[ls](?<b>e(8|16|32|64)|m).v$/,            desc: 'Vector Unit-Stride Instructions'},
  {ch: '32.7.5',  m: /^v[ls](?<a>s)(?<b>e(8|16|32|64)).v$/,       desc: 'Vector Strided Instructions'},
  {ch: '32.7.6',  m: /^v[ls](?<a>[uo]xe)(?<b>i(8|16|32|64)).v$/,  desc: 'Vector Indexed Instructions'},
  {ch: '32.7.7',  m: /^vl(?<b>e(8|16|32|64))(?<c>ff).v$/,         desc: 'Unit-stride Fault-Only-First Loads'},
  {ch: '32.7.8',  m: /^v[ls]\w*(?<a>seg)(?<b>\d)e[i]?\d+\w*.v$/,  desc: 'Vector Load/Store Segment Instructions'},
  {ch: '32.7.8.1',m: /^v[ls]seg\d(?<a>e\d+)(?<c>ff)?.v$/,         desc: 'Vector Unit-Stride Segment Loads and Stores'},
  {ch: '32.7.8.2',m: /^v[ls](?<a>s)seg\d(?<b>\w+).v$/,            desc: 'Vector Strided Segment Loads and Stores'},
  {ch: '32.7.8.3',m: /^v[ls](?<a>[ou]x)seg\d(?<b>\w+).v$/,        desc: 'Vector Indexed Segment Loads and Stores'},
  {ch: '32.7.9',  m: /^v[ls](?<a>\d)(?<b>r\w*).v$/,               desc: 'Vector Load/Store Whole Register Instructions'},

  {ch: '32.10',   m: /^v[f]?\w+.[vw][vxfi]$/,          desc: 'Vector Arithmetic Instruction Formats'},
  {ch: '32.10.2', m: /^v[f]?w\w+.[vw][vxf]$/,          desc: 'Widening Vector Arithmetic Instructions'},
  {ch: '32.10.3', m: /^v[f]?n[^m]\w+.[vw][vxfi]$/,     desc: 'Narrowing Vector Arithmetic Instructions'},

  // Integer
  {ch: '32.11.1', m: /^v(add|sub|rsub).v[vxi]$/,       desc: 'Vector Single-Width Integer Add and Subtract'},
  {ch: '32.11.2', m: /^vw(add|sub)[u]?.[vw][vx]$/,     desc: 'Vector Widening Integer Add/Subtract'},
  {ch: '32.11.3', m: /^v[sz]ext.vf\d$/,                desc: 'Vector Widening Integer Add/Subtract'},
  {ch: '32.11.4', m: /^v[m]?adc.v[vxi][m]?$/,          desc: 'Vector Integer Add-with-Carry / Subtract-with-Borrow Instructions'},
  {ch: '32.11.5', m: /^v(and|or|xor).v[vxi]$/,         desc: 'Vector Bitwise Logical Instructions'},
  {ch: '32.11.6', m: /^vs(ll|rl|ra).v[vxi]$/,          desc: 'Vector Single-Width Shift Instructions'},
  {ch: '32.11.7', m: /^vnsr[la].w[vxi]$/,              desc: 'Vector Narrowing Integer Right Shift Instructions'},
  {ch: '32.11.8', m: /^vms(eq|ne|ltu|lt|leu|le|gtu|gt).v[vxi]$/,  desc: 'Vector Integer Compare Instructions'},
  {ch: '32.11.9', m: /^v(min|max)[u]?.v[vx]$/,         desc: 'Vector Integer Min/Max Instructions'},
  {ch: '32.11.10',m: /^vmul(h|hu|hsu)?.v[vx]$/,        desc: 'Vector Single-Width Integer Multiply Instructions'},
  {ch: '32.11.11',m: /^v(div|rem)[u]?.v[vx]$/,         desc: 'Vector Integer Divide Instructions'},
  {ch: '32.11.12',m: /^vwmul([s]?u)?.v[vx]$/,          desc: 'Vector Widening Integer Multiply Instructions'},
  {ch: '32.11.13',m: /^v(macc|nmsac|madd|nmsub).v[vx]$/,  desc: 'Vector Single-Width Integer Multiply-Add Instructions'},
  {ch: '32.11.14',m: /^vwmacc(u|su|us)?.v[vx]$/,       desc: 'Vector Widening Integer Multiply-Add Instructions'},
  {ch: '32.11.15',m: /^vmerge.v[vx]m$/,                desc: 'Vector Integer Merge Instructions'},
  {ch: '32.11.16',m: /^vmv.v.[vxi]$/,                  desc: 'Vector Integer Move Instructions'},

  // Fixed-Point
  {ch: '32.12',   m: /^v[as](add|sub|mul)u?.v[vix]$/,  desc: 'Vector Fixed-Point Arithmetic Instructions'},
  {ch: '32.12.1', m: /^vs(add|sub)u?.v[vix]$/,         desc: 'Vector Single-Width Saturating Add and Subtract'},
  {ch: '32.12.2', m: /^va(add|sub)u?.v[vix]$/,         desc: 'Vector Single-Width Averaging Add and Subtract'},
  {ch: '32.12.3', m: /^vsmul.v[vx]$/,                  desc: 'Vector Single-Width Fractional Multiply with Rounding and Saturation'},
  {ch: '32.12.4', m: /^vssr[la].v[vix]$/,              desc: 'Vector Single-Width Scaling Shift Instructions'},
  {ch: '32.12.5', m: /^vnclip(u?).w[vix]$/,            desc: 'Vector Narrowing Fixed-Point Clip Instructions'},

  // Floating-Point
  {ch: '32.13',   m: /^vf\w+.(v[vf]?|w[vf])$/,         desc: 'Vector Floating-Point Instructions'},
  {ch: '32.13.2', m: /^vf(add|sub|rsub).v[vf]$/,       desc: 'Vector Single-Width Floating-Point Add/Subtract Instructions'},
  {ch: '32.13.3', m: /^vfw(add|sub).(v[vf]|w[vf])$/,   desc: 'Vector Widening Floating-Point Add/Subtract Instructions'},
  {ch: '32.13.4', m: /^vf(mul|div|rdiv).v[vf]$/,       desc: 'Vector Single-Width Floating-Point Multiply/Divide Instructions'},
  {ch: '32.13.5', m: /^vfwmul.v$/,                     desc: 'Vector Widening Floating-Point Multiply'},
  {ch: '32.13.6', m: /^vf(n?)m(acc|sac|add|sub).v[vf]$/,  desc: 'Vector Single-Width Floating-Point Fused Multiply-Add Instructions'},
  {ch: '32.13.7', m: /^vfw(n?)(macc|msac).v[vf]$/,     desc: 'Vector Widening Floating-Point Fused Multiply-Add Instructions'},
  {ch: '32.13.8', m: /^vfsqrt.v$/,                     desc: 'Vector Floating-Point Square-Root Instruction'},
  {ch: '32.13.9', m: /^vfrsqrt7.v$/,                   desc: 'Vector Floating-Point Reciprocal Square-Root Estimate Instruction'},
  {ch: '32.13.10',m: /^vfrec7.v$/,                     desc: 'Vector Floating-Point Reciprocal Estimate Instruction'},
  {ch: '32.13.11',m: /^vf(min|max).v[vf]$/,            desc: 'Vector Floating-Point MIN/MAX Instructions'},
  {ch: '32.13.12',m: /^vfsgnj[nx]?.v[vf]$/,            desc: 'Vector Floating-Point Sign-Injection Instructions'},
  {ch: '32.13.13',m: /^vmf(eq|ne|lt|le|gt|ge).v[vf]$/,desc: 'Vector Floating-Point Compare Instructions'},
  {ch: '32.13.14',m: /^vfclass.v$/,                    desc: 'Vector Floating-Point Classify Instruction'},
  {ch: '32.13.15',m: /^vfmerge.vfm$/,                  desc: 'Vector Floating-Point Merge Instruction'},
  {ch: '32.13.16',m: /^vfmv.v.f$/,                     desc: 'Vector Floating-Point Move Instruction'},
  {ch: '32.13.17',m: /^vfcvt(.rtz)?.(xu|x|f).(f|xu|x).v$/,  desc: 'Single-Width Floating-Point/Integer Type-Convert Instructions'},
  {ch: '32.13.18',m: /^vfwcvt(.rtz)?.(xu|x|f).(f|xu|x).v$/,  desc: 'Widening Floating-Point/Integer Type-Convert Instructions'},
  {ch: '32.13.19',m: /^vfncvt(.rtz)?.(xu|x|f).(f|xu|x).w$/,  desc: 'Narrowing Floating-Point/Integer Type-Convert Instructions'},

  // Reduction
  {ch: '32.14',     m: /^v[f]?[w]?(?<a>red)\w+(?<b>.vs)$/,  desc: 'Vector Reduction Operations'},

  {ch: '32.14.1',   m: /^v(?<a>red)\w+.vs$/,                desc: 'Vector Single-Width Integer Reduction Instructions'},
  {ch: '32.14.2',   m: /^v(?<a>wred)\w+.vs$/,               desc: 'Vector Widening Integer Reduction Instructions'},

  {ch: '32.14.3',   m: /^v(?<a>fred)\w+.vs$/,               desc: 'Vector Single-Width Floating-Point Reduction Instructions'},
  {ch: '32.14.3.1', m: /^vfred(?<a>osum).vs$/,              desc: 'Vector Ordered Single-Width Floating-Point Sum Reduction'},
  {ch: '32.14.3.2', m: /^vfred(?<a>usum).vs$/,              desc: 'Vector Single-Width Floating-Point Reduction Instructions'},
  {ch: '32.14.3.3', m: /^vfred(?<a>(max|min)).vs$/,         desc: 'Vector Single-Width Floating-Point Reduction Instructions'},

  {ch: '32.14.4',   m: /^v(?<a>fwred)\w+.vs$/,              desc: 'Vector Widening Floating-Point Reduction Instructions'},
];

module.exports = rvvTraits;

},{}],4:[function(require,module,exports){
'use strict';


var loader = require('./lib/loader');
var dumper = require('./lib/dumper');


function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' +
      'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}


module.exports.Type                = require('./lib/type');
module.exports.Schema              = require('./lib/schema');
module.exports.FAILSAFE_SCHEMA     = require('./lib/schema/failsafe');
module.exports.JSON_SCHEMA         = require('./lib/schema/json');
module.exports.CORE_SCHEMA         = require('./lib/schema/core');
module.exports.DEFAULT_SCHEMA      = require('./lib/schema/default');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.dump                = dumper.dump;
module.exports.YAMLException       = require('./lib/exception');

// Re-export all types in case user wants to create custom schema
module.exports.types = {
  binary:    require('./lib/type/binary'),
  float:     require('./lib/type/float'),
  map:       require('./lib/type/map'),
  null:      require('./lib/type/null'),
  pairs:     require('./lib/type/pairs'),
  set:       require('./lib/type/set'),
  timestamp: require('./lib/type/timestamp'),
  bool:      require('./lib/type/bool'),
  int:       require('./lib/type/int'),
  merge:     require('./lib/type/merge'),
  omap:      require('./lib/type/omap'),
  seq:       require('./lib/type/seq'),
  str:       require('./lib/type/str')
};

// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');

},{"./lib/dumper":6,"./lib/exception":7,"./lib/loader":8,"./lib/schema":9,"./lib/schema/core":10,"./lib/schema/default":11,"./lib/schema/failsafe":12,"./lib/schema/json":13,"./lib/type":15,"./lib/type/binary":16,"./lib/type/bool":17,"./lib/type/float":18,"./lib/type/int":19,"./lib/type/map":20,"./lib/type/merge":21,"./lib/type/null":22,"./lib/type/omap":23,"./lib/type/pairs":24,"./lib/type/seq":25,"./lib/type/set":26,"./lib/type/str":27,"./lib/type/timestamp":28}],5:[function(require,module,exports){
'use strict';


function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],6:[function(require,module,exports){
'use strict';

/*eslint-disable no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var DEFAULT_SCHEMA      = require('./schema/default');

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_BOM                  = 0xFEFF;
var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


var QUOTING_TYPE_SINGLE = 1,
    QUOTING_TYPE_DOUBLE = 2;

function State(options) {
  this.schema        = options['schema'] || DEFAULT_SCHEMA;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;
  this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes   = options['forceQuotes'] || false;
  this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c)
    && c !== CHAR_BOM
    // - b-char
    && c !== CHAR_CARRIAGE_RETURN
    && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    inblock ? // c = flow-in
      cIsNsCharOrWhitespace
      : cIsNsCharOrWhitespace
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
  )
    // ns-plain-char
    && c !== CHAR_SHARP // false on '#'
    && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
    || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
    || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_EQUALS
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
  testAmbiguousType, quotingType, forceQuotes, inblock) {

  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0))
          && isPlainSafeLast(codePointAt(string, string.length - 1));

  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
      }
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
      testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;

  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];

    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) ||
        (typeof value === 'undefined' &&
         writeNode(state, level, null, false, false))) {

      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) ||
        (typeof value === 'undefined' &&
         writeNode(state, level + 1, null, true, true, false, true))) {

      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {

    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';

    if (state.condenseFlow) pairBuffer += '"';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(
        state.tag[0] === '!' ? state.tag.slice(1) : state.tag
      ).replace(/!/g, '%21');

      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }

      state.dump = tagStr + ' ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  var value = input;

  if (state.replacer) {
    value = state.replacer.call({ '': value }, '', value);
  }

  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

  return '';
}

module.exports.dump = dump;

},{"./common":5,"./exception":7,"./schema/default":11}],7:[function(require,module,exports){
// YAML error class. http://stackoverflow.com/questions/8458984
//
'use strict';


function formatError(exception, compact) {
  var where = '', message = exception.reason || '(unknown reason)';

  if (!exception.mark) return message;

  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }

  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }

  return message + ' ' + where;
}


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};


module.exports = YAMLException;

},{}],8:[function(require,module,exports){
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var makeSnippet         = require('./snippet');
var DEFAULT_SCHEMA      = require('./schema/default');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy    = options['legacy']    || false;

  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  var mark = {
    name:     state.filename,
    buffer:   state.input.slice(0, -1), // omit trailing \0
    position: state.position,
    line:     state.line,
    column:   state.position - state.lineStart
  };

  mark.snippet = makeSnippet(mark);

  return new YAMLException(message, mark);
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
  startLine, startLineStart, startPos) {

  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _lineStart,
      _pos,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = Object.create(null),
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C/* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }

  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }

    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];

      if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];

      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }

    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }

    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }

    if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  var nullpos = input.indexOf('\0');

  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }

  var documents = loadDocuments(input, options);

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


module.exports.loadAll = loadAll;
module.exports.load    = load;

},{"./common":5,"./exception":7,"./schema/default":11,"./snippet":14}],9:[function(require,module,exports){
'use strict';

/*eslint-disable max-len*/

var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  return this.extend(definition);
}


Schema.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof Type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new YAMLException('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type.multi) {
      throw new YAMLException('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


module.exports = Schema;

},{"./exception":7,"./type":15}],10:[function(require,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


module.exports = require('./json');

},{"./json":13}],11:[function(require,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


module.exports = require('./core').extend({
  implicit: [
    require('../type/timestamp'),
    require('../type/merge')
  ],
  explicit: [
    require('../type/binary'),
    require('../type/omap'),
    require('../type/pairs'),
    require('../type/set')
  ]
});

},{"../type/binary":16,"../type/merge":21,"../type/omap":23,"../type/pairs":24,"../type/set":26,"../type/timestamp":28,"./core":10}],12:[function(require,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  explicit: [
    require('../type/str'),
    require('../type/seq'),
    require('../type/map')
  ]
});

},{"../schema":9,"../type/map":20,"../type/seq":25,"../type/str":27}],13:[function(require,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


module.exports = require('./failsafe').extend({
  implicit: [
    require('../type/null'),
    require('../type/bool'),
    require('../type/int'),
    require('../type/float')
  ]
});

},{"../type/bool":17,"../type/float":18,"../type/int":19,"../type/null":22,"./failsafe":12}],14:[function(require,module,exports){
'use strict';


var common = require('./common');


// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }

  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }

  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}


function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}


function makeSnippet(mark, options) {
  options = Object.create(options || null);

  if (!mark.buffer) return null;

  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent      !== 'number') options.indent      = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

  var re = /\r?\n|\r|\0/g;
  var lineStarts = [ 0 ];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;

  while ((match = re.exec(mark.buffer))) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);

    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }

  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

  var result = '', i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n' + result;
  }

  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
    ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
  }

  return result.replace(/\n$/, '');
}


module.exports = makeSnippet;

},{"./common":5}],15:[function(require,module,exports){
'use strict';

var YAMLException = require('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'multi',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'representName',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options       = options; // keep original options in case user wants to extend this type later
  this.tag           = tag;
  this.kind          = options['kind']          || null;
  this.resolve       = options['resolve']       || function () { return true; };
  this.construct     = options['construct']     || function (data) { return data; };
  this.instanceOf    = options['instanceOf']    || null;
  this.predicate     = options['predicate']     || null;
  this.represent     = options['represent']     || null;
  this.representName = options['representName'] || null;
  this.defaultStyle  = options['defaultStyle']  || null;
  this.multi         = options['multi']         || false;
  this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":7}],16:[function(require,module,exports){
'use strict';

/*eslint-disable no-bitwise*/


var Type = require('../type');


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(obj) {
  return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":15}],17:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":15}],18:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":5,"../type":15}],19:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'o') {
      // base 8
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  return true;
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch;

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":5,"../type":15}],20:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});

},{"../type":15}],21:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

},{"../type":15}],22:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});

},{"../type":15}],23:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

},{"../type":15}],24:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":15}],25:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});

},{"../type":15}],26:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

},{"../type":15}],27:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});

},{"../type":15}],28:[function(require,module,exports){
'use strict';

var Type = require('../type');

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":15}]},{},[1]);
