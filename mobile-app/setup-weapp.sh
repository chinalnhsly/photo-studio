#!/bin/bash

# 确保在正确目录
cd /home/liyong/photostudio/mobile-app

# 安装 Taro 小程序相关依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/helper@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/plugin-platform-weapp@4.0.9 \
  @tarojs/plugin-platform-h5@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/shared@4.0.9 \
  @tarojs/taro@4.0.9 --exact

# 清理缓存
yarn cache clean

# 重新安装所有依赖
yarn install

# 删除编译缓存
rm -rf .taro-cache
rm -rf dist

# 重新启动开发环境
yarn dev:weapp
