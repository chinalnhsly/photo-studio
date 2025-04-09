const path = require('path')

const config = {
  // 必需的框架配置
  framework: 'react',
  
  // 基础配置
  projectName: 'mobile-app',
  date: '2024-2-27',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  
  // 插件配置
  plugins: [
    '@tarojs/plugin-framework-react'
  ],
  
  // 定义常量
  defineConstants: {
  },
  
  // 复制选项
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  
  // 缓存配置
  cache: {
    enable: true,
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  // 小程序配置
  mini: {
    optimizeMainPackage: {
      enable: true
    },
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
      }
    }
  },
  
  // H5配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
