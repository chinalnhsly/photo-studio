#!/bin/bash

# 清理现有环境
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json
rm -rf .taro-cache

# 安装核心依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/helper@4.0.9 \
  @tarojs/shared@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 安装必要的 peer dependencies
yarn add postcss@8.4.35 \
  solid-js@1.8.15 \
  --exact

# 安装开发依赖
yarn add -D @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  @types/node@18.0.0 \
  @types/webpack-env@1.18.4 \
  --exact

# 创建 Taro 配置文件
mkdir -p config
cat > config/index.js << 'EOL'
const config = {
  projectName: 'mobile-app',
  date: '2024-4-9',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
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
EOL

# 重新安装所有依赖
yarn install

echo "依赖修复完成，正在构建项目..."
yarn build:weapp
