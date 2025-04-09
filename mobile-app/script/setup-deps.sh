#!/bin/bash

# 清理现有依赖
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json

# 安装核心依赖
yarn add @babel/core@^7.12.0 \
  @tarojs/cli@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/helper@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/plugin-platform-weapp@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/service@4.0.9 \
  @tarojs/shared@4.0.9 \
  @tarojs/taro@4.0.9 \
  babel-preset-taro@4.0.9 \
  postcss@^8.4.35 \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  webpack@5.91.0 --exact

# 安装开发依赖
yarn add -D @types/react@^18.2.0 \
  @types/react-dom@^18.2.0 \
  less@^4.2.0 \
  stylus@^0.62.0 \
  typescript@^5.0.4

# 清理缓存并重新构建
yarn cache clean
rm -rf .taro-cache
rm -rf dist

# 重新启动开发服务器
yarn dev:weapp
