#!/bin/bash

# 删除现有的 node_modules 和缓存
rm -rf node_modules
rm -rf .taro-cache
rm -f yarn.lock

# 添加必要的类型定义
yarn add -D @types/node@^18.0.0 \
  @types/webpack-env@^1.18.4 \
  @types/react@^18.2.0 \
  @types/react-dom@^18.2.0 \
  --exact

# 修复其他可能的类型依赖
yarn add -D typescript@^5.0.4 \
  @types/webpack@^5.28.0 \
  --exact

# 清理 TypeScript 缓存
rm -rf node_modules/.cache/typescript

# 重新安装所有依赖
yarn install

# 重新构建
yarn dev:weapp
