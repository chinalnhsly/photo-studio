#!/bin/bash

# 清理依赖和缓存
rm -rf node_modules
rm -rf .taro-cache
rm -rf dist
rm -f package-lock.json
rm -f yarn.lock

# 安装新的依赖
yarn add @babel/core@^7.12.0 \
  @babel/runtime@^7.12.0 \
  babel-preset-taro@4.0.9 \
  --exact

yarn add -D @babel/plugin-transform-runtime@^7.12.0 \
  @babel/plugin-transform-class-properties@^7.12.0 \
  @babel/plugin-transform-decorators@^7.12.0 \
  --exact

# 重新构建
yarn install
yarn dev:weapp
