const path = require('path');

const config = {
  projectName: 'minimal-taro',
  date: '2023-6-15',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react'
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  alias: {
    "@": path.resolve(__dirname, "..", "src"),
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/store": path.resolve(__dirname, "..", "src/store"),
    "@/utils": path.resolve(__dirname, "..", "src/utils"),
    "@/assets": path.resolve(__dirname, "..", "src/assets")
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
    sass: {
      resource: []
    },
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
    sass: {
      resource: []
    },
      autoprefixer: {
        enable: true,
        config: {}
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
