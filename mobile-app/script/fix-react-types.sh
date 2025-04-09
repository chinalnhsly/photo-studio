#!/bin/bash

# 删除现有的 React 相关类型定义
rm -rf node_modules/@types/react
rm -rf node_modules/@types/react-dom

# 安装指定版本的 React 类型定义
yarn add -D @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  --exact

# 清理 TypeScript 缓存
rm -rf node_modules/.cache/typescript

# 重新安装核心依赖
yarn add react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 重新构建项目
yarn dev:weapp
