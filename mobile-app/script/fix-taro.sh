#!/bin/bash

# 清理依赖
rm -rf node_modules
rm -f yarn.lock

# 安装必要的依赖
yarn add postcss@8.4.18 \
  webpack@5.91.0 \
  @tarojs/runtime@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  react@18.0.0 \
  react-dom@18.0.0 \
  --exact

# 重新构建
yarn build:weapp

echo "Taro 依赖修复完成！"
