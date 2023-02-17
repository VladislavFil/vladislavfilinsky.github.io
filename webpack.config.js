// CORE
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const postcssPresetEnv = require('postcss-preset-env')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// CONTSTANTS
const SOURCE_DIR = path.join(__dirname, 'src')
const DIST_DIR = path.join(__dirname, 'dist')
const PROJECT_ROOT = path.resolve(__dirname)
const PAGES_DIR = `${SOURCE_DIR}/views/pages`
const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = !__DEV__
const HOST = 'localhost'
const PORT = 8080

// OPTIONS
const OPTIONS = {
  analyze: false,
  minify: false,
  hash: true,
  local: false,
}

// PAGES
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.pug'))

// RULES
const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loader: { scss: 'vue-style-loader!css-loader!sass-loader' },
    },
  },
  {
    test: /.pug$/,
    use: [
      {
        loader: 'simple-pug-loader',
        options: {
          pretty: true,
          root: SOURCE_DIR,
        },
      },
    ],
  },
  {
    test: /\.((c|sa|sc)ss)$/i,
    use: [
      'css-hot-loader',
      {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../' },
      },
      {
        // Translates CSS into CommonJS
        loader: 'css-loader',
        options: {
          sourceMap: __DEV__,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [postcssPresetEnv({})],
          },
        },
      },
      {
        // Compiles Sass to CSS
        loader: 'sass-loader',
        options: {
          sourceMap: __DEV__,
        }
      },
    ],
  },
  {
    test: /\.(woff|woff2|svg|eot|ttf|otf)$/,
    include: /[\\/]fonts[\\/]/,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name][ext]',
      emit: false,
    },
  },
  // images
  {
    test: /\.(png|gif|jpe?g|webp|webm|mp4)$/i,
    resourceQuery: { not: [/inline/] }, // ignore images with `?inline` query
    type: 'asset/resource',
    include: /assets[\\/]img/,
    generator: {
      filename: 'assets/img/[name][ext]'
      // filename: OPTIONS.hash
      //   ? 'assets/img/[name].[hash:7][ext]'
      //   : 'assets/img/[name][ext]',
    },
  },
  {
    test: /\.(svg)$/i,
    type: 'asset/resource',
    include: /assets[\\/]img/,
    exclude: /assets[\\/]img[\\/]sprite/,
    generator: {
      filename: 'assets/img/icons/[name][ext]'
      // filename: OPTIONS.hash
      //   ? 'assets/img/icons/[name].[hash:8][ext]'
      //   : 'assets/img/icons/[name][ext]',
    },
  },

  // inline images: png or svg icons with size < 4 KB
  // {
  //   test: /\.(png|svg)$/i,
  //   type: 'asset',
  //   include: /assets[\\/]images/,
  //   exclude: /favicon/, // don't inline favicon
  //   parser: {
  //     dataUrlCondition: {
  //       maxSize: 4 * 1024,
  //     },
  //   },
  // },

  // force inline svg file containing `?inline` query
  // {
  //   test: /\.(svg)$/i,
  //   resourceQuery: /inline/,
  //   type: 'asset/inline',
  // },
]

// PLUGINS
const plugins = [
  new CleanWebpackPlugin(),
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: __DEV__,
  }),
  new MiniCssExtractPlugin({
    filename:
      __DEV__ || !OPTIONS.hash
        ? `assets/css/[name].css`
        : `assets/css/[name].[contenthash:7].css`,
  }),
  new SVGSpritemapPlugin(`src/assets/img/sprite/**/*.svg`, {
    output: {
      filename: `assets/img/spritemap.svg`,
      svgo: true,
    },
    sprite: {
      prefix: false,
      generate: {
        title: false,
        use: true,
      },
    },
  }),
  new CopyPlugin({
    patterns: [
      {
        from: `src/assets/fonts`,
        to: `assets/fonts/`,
      },
      {
        from: 'src/assets/scss/base/custom.css',
        to: 'assets/css/',
      },
      { from: 'src/static', to: '' },
    ],
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),

  ...PAGES.map(
    (page) =>
      new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`,
        minify: false,
      })
  ),
]

if (OPTIONS.analyze) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      statsOptions: { source: false },
    })
  )
}

if (OPTIONS.minify) {
  plugins.push(
    new ImageminPlugin({
      pngquant: {
        quality: '80',
      },
    })
  )
}

// ALIAS
const resolve = {
  fallback: { url: require.resolve('url/') },
  alias: {
    '@': SOURCE_DIR,
    '@image': `${SOURCE_DIR}/assets/img`,
    '@components': `${SOURCE_DIR}/components`,
    '@modules': `${SOURCE_DIR}/components/modules`,
    '@node_modules': `${PROJECT_ROOT}/node_modules`,
    '@common': `${SOURCE_DIR}/assets/js/common`,
    '@style': `${SOURCE_DIR}/assets/scss`,
    '@App': `${SOURCE_DIR}/App`,
  },
}

// MODULES
module.exports = {
  mode: __DEV__ ? 'development' : 'production',
  watchOptions: {
    ignored: /node_modules/,
  },
  performance: {
    hints: __DEV__ ? false : 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: __DEV__ ? 'eval-cheap-module-source-map' : false,
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: DIST_DIR,
    },
    open: true,
    port: PORT,
    host: HOST,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  entry: {
    main: SOURCE_DIR,
  },
  output: {
    filename:
      __DEV__ || !OPTIONS.hash
        ? `assets/js/[name].js`
        : `assets/js/[name].[contenthash:8].js`,
    path: DIST_DIR,
    publicPath: OPTIONS.local ? '/' : '',
  },
  target: __DEV__ ? 'web' : 'browserslist',
  optimization: {
    minimize: __PROD__,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: __PROD__,
        },
      },
    },
  },
  module: {
    rules,
  },
  resolve,
  plugins,
}

// INFO
const t = '<i> [webpack-config] '
console.warn(t + `Хеш ресорсов: ${OPTIONS.hash ? 'On' : 'Off'}`)
console.warn(t + `Сжатие изображений: ${OPTIONS.minify ? 'On' : 'Off'}`)
console.warn(t + `Анализ js: ${OPTIONS.analyze ? 'On' : 'Off'}`)
