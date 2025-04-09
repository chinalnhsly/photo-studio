#!/bin/bash

# 创建类型声明目录
mkdir -p types

# 安装类型依赖
yarn add -D @types/jest@^29.5.12 --exact

# 清理缓存
rm -rf node_modules/.cache/typescript

# 重新启动构建
yarn dev:weapp
