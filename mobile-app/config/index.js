const path = require('path');

const config = {
  projectName: 'photostudio-mobile',
  date: '2023-6-15',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/types': path.resolve(__dirname, '..', 'src/types')
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain, webpack) {
      // 设置别名，解决路径问题
      chain.resolve.alias
        .set('@', path.resolve(__dirname, '..', 'src'))
        .set('@/components', path.resolve(__dirname, '..', 'src/components'))
        .set('@/pages', path.resolve(__dirname, '..', 'src/pages'))
        .set('@/assets', path.resolve(__dirname, '..', 'src/assets'))
        .set('@/styles', path.resolve(__dirname, '..', 'src/styles'))
        .set('@/utils', path.resolve(__dirname, '..', 'src/utils'))
        .set('@/types', path.resolve(__dirname, '..', 'src/types'));
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
