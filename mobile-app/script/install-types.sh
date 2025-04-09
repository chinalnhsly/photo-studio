#!/bin/bash

# 清理现有的 node_modules
rm -rf node_modules
rm -f yarn.lock

# 先安装核心依赖
yarn add -D @types/node@^18.0.0 @types/webpack-env@^1.18.4 --exact

# 安装其他所需的类型定义
yarn add -D @types/react@^18.2.0 @types/react-dom@^18.2.0 --exact

# 清理 TypeScript 缓存
rm -rf node_modules/.cache/typescript

# 重新安装所有依赖
yarn install

# 清理并重启
rm -rf dist
rm -rf .taro-cache
yarn dev:weapp
