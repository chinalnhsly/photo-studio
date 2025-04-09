#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 安装核心依赖
yarn add @tarojs/cli@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/components@4.0.9 \
  react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 安装开发依赖
yarn add -D @tarojs/webpack5-runner@4.0.9 \
  cross-env@7.0.3 \
  --exact

# 清理缓存
rm -rf node_modules/.cache
rm -rf .taro-cache

# 重新构建
yarn build:weapp

echo "配置修复完成，现在应该可以正常构建了"
