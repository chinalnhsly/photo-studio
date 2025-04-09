#!/bin/bash

# 清理缓存和构建文件
rm -rf dist
rm -rf .taro-cache

# 生产环境构建
NODE_ENV=production yarn build:weapp

echo "构建完成！请在微信开发者工具中预览"
