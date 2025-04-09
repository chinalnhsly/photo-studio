#!/bin/bash

cd /home/liyong/photostudio/mobile-app

# 清理缓存和构建文件
rm -rf dist
rm -rf .taro-cache

# 重新安装依赖
yarn install

# 重新构建
yarn build:weapp

echo "构建完成！请在微信开发者工具中重新预览：$(pwd)/dist"
