// const webpack = require('webpack');
const path = require('path');

/**
 * @param packagePath repo root folder
 * @param filename resulting file name
 * @param name of resulting global varaible AND name of class exported from entry file
 * @param entry source file path
 * @param tsconf tsconfig path
 * @description Shared webpack configuration for all packages
 */
function getWebPackConfig(packagePath, filename, library, entry, tsconf) {
  return {
    mode: 'production',
    entry: path.resolve(packagePath, entry),
    output: {
      path: path.resolve(packagePath, 'dist', 'web'),
      filename: filename,
      library: library,
      libraryExport: library,
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    externals: {
      web3: 'web3',
      'web3-eth-abi': 'web3-eth-abi',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(packagePath, tsconf),
          },
          exclude: ['/node_modules/', '/test/'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      // fallback: {
      //   stream: require.resolve('readable-stream'),
      // },
      extensionAlias: {
        '.js': ['.js', '.ts'],
      },
    },
    devtool: 'source-map',
  };
}

const tsconf = 'tsconfig.cjs.json'
module.exports = [
  getWebPackConfig(__dirname, 'web3-multicall3.min.js', 'Web3Multicall3', 'src/index.ts', tsconf),
  getWebPackConfig(__dirname, 'web3-multicall3-plugin.min.js', 'Web3Multicall3Plugin', 'src/plugin/index.ts', tsconf),
];
