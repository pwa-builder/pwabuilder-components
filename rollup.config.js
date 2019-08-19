import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

const extensions = [".js", ".ts"];

const commonPlugins = [
  resolve({ module: true, jsnext: true, extensions }),
  typescript(),
  commonjs({
    extensions, include: 'node_modules/**', namedExports: {
      "node_modules/adaptivecards/lib/adaptivecards.js": [
        'AdaptiveCard',
        'Version',
        'TextBlock',
        'Image'
      ]
    }
  })
];

const babelPlugins = [
  [
    "@babel/plugin-proposal-decorators",
    { decoratorsBeforeExport: true, legacy: false }
  ],
  "@babel/proposal-class-properties",
  "@babel/proposal-object-rest-spread"
];

const babelInclude = [
  "src/**/*",
  "node_modules/lit-element/**/*",
  "node_modules/lit-html/**/*"
];

module.exports = {
  input: 'src/index.ts',
  output: {
    dir: 'dist/esm',
    format: 'umd',
    name: 'pwb'
  },
  plugins: [
    babel({
      extensions,
      presets: [
        "@babel/preset-typescript",
        [
          "@babel/preset-env", {
            "targets": ">25%"
          }
        ],
      ],
      plugins: babelPlugins,
      include: babelInclude,
    }),
    ...commonPlugins
  ]
};