#!/bin/bash

# 清理依赖和缓存
rm -rf node_modules
rm -rf .taro-cache
rm -rf dist
rm -f yarn.lock
rm -f package-lock.json

# 添加核心依赖
yarn add @babel/core@^7.12.0 \
  @babel/runtime@^7.12.0 \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  --exact

# 添加 Taro 依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/plugin-platform-weapp@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/shared@4.0.9 \
  @tarojs/taro@4.0.9 \
  babel-preset-taro@4.0.9 \
  --exact

# 添加开发依赖
yarn add -D @types/react@^18.2.0 \
  @types/react-dom@^18.2.0 \
  typescript@^5.0.4 \
  --exact

# 重新启动
yarn dev:weapp
