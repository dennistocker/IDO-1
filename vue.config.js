const path = require("path");
const devServer = require("./src/scripts/devServer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    ...devServer(),
  },
  chainWebpack: (config) => {
    // alias
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("@utils", resolve("src/utils"))
      .set("@components", resolve("src/components"))
      .set("@StarUI", resolve("src/components/StarUI"))
      .set("@api", resolve("src/api"))
      .set("@utils", resolve("src/utils"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"))
      .set("@styles", resolve("src/styles"))
      .set("@scripts", resolve("src/scripts"))
      .set("@constants", resolve("src/constants"))
      .set("@mixins", resolve("src/mixins"))
      .set("@contactLogic", resolve("src/contactLogic"));

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    // image
    // config.module
    //   .rule("images")
    //   .exclude.add(resolve("src/icons"))
    //   .end()
    //   .use("image-webpack-loader")
    //   .loader("image-webpack-loader")
    //   .options({
    //     mozjpeg: { progressive: true, quality: 65 },
    //     optipng: { enabled: true },
    //     pngquant: { quality: [0.65, 0.9], speed: 4 },
    //     gifsicle: { interlaced: false },
    //     // webp: { quality: 75 }
    //   });
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  },
};
// css: {
// loaderOptions: {
// css: {
//   modules: {
//     localIdentName: "[name]-[hash]",
//   },
//   localsConvention: "camelCaseOnly",
// },
// },
// },
// };
