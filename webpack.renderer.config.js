const rules = require('./webpack.rules');
const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  entry: path.join(__dirname, 'src', 'renderer.tsx'),
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
