#!/bin/bash

# 清理旧依赖
rm -rf node_modules
rm -f yarn.lock

# 安装最新的 Taro 相关依赖
yarn add @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/components@4.0.9 \
  --exact

# 安装开发依赖
yarn add -D sass@1.69.7 \
  sass-loader@13.3.3 \
  --exact

# 重新构建
yarn build:weapp
