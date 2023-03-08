[![CI Status](https://github.com/drom/rv/actions/workflows/linux.yml/badge.svg)](https://github.com/drom/rv/actions/workflows/linux.yml)

## RISC-V ISA online string decoder

https://rv.drom.io

![](screenshot.png)

## Test & Build

```
npm i
npm test
npm run build
./node_modules/.bin/live-server docs &
```

Uses [riscv](https://www.npmjs.com/package/riscv) NPM package.

## Command Line Interface version

`npx riscv --isa rv32g`

## License

Apache 2.0 [LICENSE](https://github.com/drom/rv/blob/master/LICENSE).
