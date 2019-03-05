import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const external = Object.keys(pkg.peerDependencies)

export default [
  // browser-friendly UMD build
  // {
  //   input: 'src/index.ts',
  //   output: {
  //     name: 'ReduxReactor',
  //     file: pkg.browser,
  //     format: 'umd',
  //     sourcemap: true
  //   },
  //   external,
  //   plugins: [
  //     typescript({ useTsconfigDeclarationDir: true }),
  //     resolve({
  //       browser: true,
  //     }),
  //     commonjs({
  //       namedExports: {
  //         'node_modules/typesafe-actions/dist/index.umd.js': [ 'createAction', 'getType', 'ActionType' ],
  //         'node_modules/react/index.js': [ 'Component' ]
  //       }
  //     }),
  //     terser(),
  //   ],
  //   watch: {
  //     include: 'src/**'
  //   }
  // },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    external,
    plugins: [
      json(),
      typescript({ useTsconfigDeclarationDir: true }),
      resolve({
        browser: true
      }),
      commonjs({
        namedExports: {
          'node_modules/typesafe-actions/dist/index.umd.js': [ 'createAction', 'getType', 'ActionType' ],
          'node_modules/react/index.js': [ 'Component' ]
        }
      }),
      terser()
    ],
    watch: {
      include: 'src/**'
    }
  }
]
