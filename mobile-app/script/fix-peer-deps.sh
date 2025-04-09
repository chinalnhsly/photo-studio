#!/bin/bash

# 删除现有的 node_modules 和锁文件
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json

# 安装和固定版本的核心依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/webpack5-runner@4.0.9 \
  webpack@5.91.0 \
  react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 安装开发依赖
yarn add -D @tarojs/components@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/service@4.0.9 \
  solid-js@1.9.5 \
  less@4.0.0 \
  stylus@0.62.0 \
  --exact

# 修复 webpack 相关依赖
yarn add -D webpack-cli@5.1.4 \
  webpack-dev-server@4.15.1 \
  webpack-dev-middleware@5.3.4 \
  --exact

# 清理缓存
rm -rf .taro-cache
rm -rf node_modules/.cache

# 重新安装依赖并构建
yarn install
yarn dev:weapp
