import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
// @ts-ignore
import json from 'rollup-plugin-json'
// @ts-ignore
import pkg from './package.json'

const external = Object.keys(pkg.peerDependencies)

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' }
    ],
    external,
    plugins: [
      json(),
      typescript({ useTsconfigDeclarationDir: true }),
      commonjs(),
      resolve({
        browser: true
      })
    ],
    watch: {
      include: 'src/**'
    }
  }
]
