const path = require('path');
const { addWebpackAlias, override, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    styles: path.resolve(__dirname, 'src/core/styles'),
  })
);
