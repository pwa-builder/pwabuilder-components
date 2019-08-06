import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const extensions = [".js"];

const commonPlugins = [
  resolve({ module: true, jsnext: true, extensions })
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
  input: 'build/es6/index.js',
  output: {
    dir: 'dist/esm',
    format: 'umd',
    name: 'pwb'
  },
  plugins: [
    babel({
      extensions,
      presets: [
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