const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./css", to: "./css" },
        { from: "./images", to: "./images" },
        { from: "./index.html", to: "./index.html" },
      ],
    }),
  ],
};