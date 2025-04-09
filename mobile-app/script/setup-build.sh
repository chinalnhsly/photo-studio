#!/bin/bash

# 安装必要的构建依赖
yarn add -D \
  webpack@5.91.0 \
  webpack-cli@5.1.4 \
  terser-webpack-plugin@5.3.10 \
  path-browserify@1.0.1 \
  stream-browserify@3.0.0 \
  @babel/core@7.24.0 \
  @babel/preset-env@7.24.0 \
  @babel/preset-react@7.23.3 \
  @babel/preset-typescript@7.23.3 \
  @babel/plugin-transform-runtime@7.24.0 \
  babel-loader@9.1.3 \
  --exact

# 清理缓存
rm -rf node_modules/.cache
rm -rf dist

# 重新构建
yarn build:weapp

echo "构建环境已设置完成！"
