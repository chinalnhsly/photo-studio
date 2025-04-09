#!/bin/bash

# 清理依赖和缓存
rm -rf node_modules
rm -rf .taro-cache
rm -rf dist
rm -f yarn.lock

# 安装 Taro 相关依赖
yarn add @tarojs/cli@4.0.9 \
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
  --exact

# 重新启动
yarn dev:weapp
