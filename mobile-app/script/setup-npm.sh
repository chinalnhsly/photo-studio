#!/bin/bash

# 确保在正确的目录
cd "$(dirname "$0")"

# 清理旧的构建文件
rm -rf node_modules
rm -rf dist
rm -f package-lock.json

# 安装依赖
yarn install

# 构建项目
yarn build:weapp

# 确保 dist 目录存在 package.json
cp package.json dist/

# 在 dist 目录下安装依赖
cd dist
yarn install --production

echo "NPM 构建环境已准备就绪！"
echo "请在微信开发者工具中:"
echo "1. 点击'工具' -> '构建 npm'"
echo "2. 点击'编译'"
