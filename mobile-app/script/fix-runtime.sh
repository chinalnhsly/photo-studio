#!/bin/bash

# 清理缓存
rm -rf node_modules/.cache
rm -rf .taro-cache

# 安装正确的依赖版本
yarn add @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/react@4.0.9 \
  --exact

# 重新构建
yarn build:weapp
