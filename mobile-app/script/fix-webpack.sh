#!/bin/bash

# 清理环境
rm -rf node_modules
rm -rf dist
rm -rf .taro-cache
rm -f yarn.lock
rm -f package-lock.json

# 安装 Taro 核心依赖（使用统一的 4.0.1 版本）
yarn add @tarojs/cli@4.0.1 \
  @tarojs/taro@4.0.1 \
  @tarojs/components@4.0.1 \
  @tarojs/react@4.0.1 \
  @tarojs/runtime@4.0.1 \
  @tarojs/mini-runner@4.0.1 \
  @tarojs/webpack-runner@4.0.1 \
  @tarojs/plugin-framework-react@4.0.1 \
  --exact

# 安装 webpack 相关依赖
yarn add -D webpack@5.91.0 \
  webpack-cli@5.1.4 \
  webpack-dev-server@4.15.1 \
  @types/webpack-env@1.18.4 \
  --exact

# 创建 webpack 配置
cat > config/webpack.config.js << 'EOL'
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
  entry: './src/app.ts',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    clean: true
  }
}
EOL

# 更新 package.json 版本号
jq '.dependencies."@tarojs/mini-runner" = "4.0.1"' package.json > package.json.tmp && mv package.json.tmp package.json

# 更新 package.json 的脚本部分
jq '.scripts += {
  "dev:weapp": "taro build --type weapp --watch",
  "build:weapp": "NODE_ENV=production taro build --type weapp"
}' package.json > package.json.tmp && mv package.json.tmp package.json

# 重新安装所有依赖
yarn install

# 重新构建
yarn build:weapp

echo "依赖版本已更新到 4.0.1！请在微信开发者工具中重新构建项目"
