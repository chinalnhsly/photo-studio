#!/bin/bash

# 清理环境
rm -rf node_modules dist
rm -f yarn.lock

# 安装核心依赖
yarn add -D @babel/core@7.22.0 \
  @babel/preset-env@7.22.0 \
  @babel/preset-react@7.22.0 \
  @babel/preset-typescript@7.22.0 \
  babel-loader@9.1.3 \
  webpack@5.88.0 \
  webpack-cli@5.1.4 \
  --exact

# 强制重新构建
NODE_ENV=development yarn build:weapp
