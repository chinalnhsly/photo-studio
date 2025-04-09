#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 创建 types 目录
mkdir -p src/types

# 安装依赖
yarn add -D @types/node@18.16.0 @types/react@18.2.0 @types/react-dom@18.2.0

# 修改 tsconfig.json 添加类型引用路径
jq '.compilerOptions.typeRoots = ["./node_modules/@types", "./src/types"] | .compilerOptions.skipLibCheck = true' tsconfig.json > tsconfig.json.new
mv tsconfig.json.new tsconfig.json

echo "类型定义问题已修复，请重新构建项目"

# 重新构建
yarn build:weapp
