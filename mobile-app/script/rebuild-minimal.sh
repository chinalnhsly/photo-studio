#!/bin/bash

# 清理环境
rm -rf node_modules
rm -rf dist
rm -f yarn.lock

# 安装最小依赖集
yarn add -D \
  @babel/core@7.24.0 \
  @babel/preset-env@7.24.0 \
  @babel/preset-react@7.23.3 \
  @babel/preset-typescript@7.23.3 \
  babel-loader@9.1.3 \
  webpack@5.91.0 \
  webpack-cli@5.1.4 \
  --exact

# 强制更新依赖
yarn install --force

# 构建项目
yarn build:weapp

echo "使用精简配置重新构建完成！"
