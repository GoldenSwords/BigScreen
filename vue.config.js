"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const path = require("path");

let cesiumSource = "node_modules/cesium/Source";
let cesiumWorkers = "node_modules/cesium/Build/Cesium/Workers";
function resolve(dir) {
  return path.join(__dirname, dir);
}
const dllReference = config => {
  config.plugin("vendorDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/vendor.manifest.json")
    }
  ]);

  config.plugin("utilDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/util.manifest.json")
    }
  ]);

  config
    .plugin("addAssetHtml")
    .use(AddAssetHtmlPlugin, [
      [
        {
          filepath: require.resolve(
            path.resolve(__dirname, "dll/vendor.dll.js")
          ),
          outputPath: "dll",
          publicPath: "/dll"
        },
        {
          filepath: require.resolve(path.resolve(__dirname, "dll/util.dll.js")),
          outputPath: "dll",
          publicPath: "/dll"
        }
      ]
    ])
    .after("html");
};
module.exports = {
  publicPath: "/",
  outputDir: "dist",
  devServer: {
    port: 8080,
    https: false,
    hotOnly: true,
    disableHostCheck: true,
    open: true
  },
  productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
  configureWebpack: {
    output: {
      sourcePrefix: " "
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: path.resolve(cesiumWorkers), to: "Workers" }
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "Assets"), to: "Assets" }
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "Widgets"), to: "Widgets" }
      ]),
      new CopyWebpackPlugin([
        {
          from: path.join(cesiumSource, "ThirdParty/Workers"),
          to: "ThirdParty/Workers"
        }
      ]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("./")
      })
    ],
    module: {
      unknownContextCritical: false
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("node_modules", resolve("node_modules"))
      .set("cesium", resolve("node_modules/cesium"));
    if (process.env.NODE_ENV === "production") {
      dllReference(config);
    }
  }
};
