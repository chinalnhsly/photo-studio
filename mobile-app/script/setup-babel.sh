#!/bin/bash

# 清理依赖和缓存
rm -rf node_modules
rm -rf .taro-cache
rm -rf dist
rm -f package-lock.json
rm -f yarn.lock

# 安装 Babel 核心和运行时
yarn add @babel/core@^7.12.0 @babel/runtime@^7.12.0 --exact

# 安装 Babel 插件
yarn add -D @babel/plugin-proposal-decorators@^7.22.0 \
  @babel/plugin-proposal-class-properties@^7.18.6 \
  @babel/plugin-transform-runtime@^7.12.0 \
  --exact

# 重新安装所有依赖
yarn install

# 启动开发服务器
yarn dev:weapp
