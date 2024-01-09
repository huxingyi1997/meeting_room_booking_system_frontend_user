const path = require('path');
const { addBeforeLoaders, removeLoaders, loaderByName } = require("@craco/craco");
const WebpackBar = require('webpackbar');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const pathResolve = pathUrl => path.join(__dirname, pathUrl);
const smp = new SpeedMeasurePlugin();
module.exports = {
  reactScriptsVersion: 'react-scripts' /* (default value) */,
  babel: {
    loaderOptions: {
      // babel-loader开启缓存
      cacheDirectory: true,
    },
  },
  webpack: smp.wrap({
    configure: (webpackConfig, { env }) => {
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        cacheGroups: {
          commons: {
            chunks: "all",
            // 将两个以上的chunk所共享的模块打包至commons组。
            minChunks: 2,
            name: "commons",
            priority: 80,
          },
        },
      };

      if (env !== 'development') {
        webpackConfig.plugins = webpackConfig.plugins.concat(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            openAnalyzer: true, // 构建完打开浏览器
            reportFilename: path.resolve(__dirname, `analyzer/index.html`),
          })
        );
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            parallel: true, //开启并行压缩，可以加快构建速度
          }),
        ];
        // 生产环境关闭source-map
        webpackConfig.devtool = false;
        // 生产环境移除source-map-loader
        removeLoaders(webpackConfig, loaderByName("source-map-loader"));
      } else {
        addBeforeLoaders(webpackConfig, loaderByName("style-loader"), "thread-loader");
        addBeforeLoaders(webpackConfig, loaderByName("style-loader"), "cache-loader");
      }
      // 开启持久化缓存
      webpackConfig.cache.type = "filesystem";
      webpackConfig.module.rules.forEach((rule) => {
        rule.include = path.resolve(__dirname, "src");
      });
      return webpackConfig;
    },
    alias: {
      '@': pathResolve('src'),
      '@components': pathResolve('src/components'),
    },
    plugins: [new WebpackBar()],
  }),
  devServer: {
    // 本地服务的端口号
    port: 3001,
    // 本地服务的响应头设置
    headers: {},
  },
};