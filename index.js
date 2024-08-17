const minify = require("@node-minify/core");
const htmlMinifier = require("@node-minify/html-minifier");
const babelMinify = require("@node-minify/babel-minify");

minify({
  compressor: htmlMinifier,
  input: "./src/index.html",
  output: "./pub/index.html",
  callback: function (err, min) {},
});
