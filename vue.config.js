"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set("node_modules", resolve("node_modules"));
  }
};
