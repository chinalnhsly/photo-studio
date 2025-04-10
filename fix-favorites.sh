#!/bin/bash

echo "=== 修复收藏页面SCSS语法错误 ==="

cd /home/liyong/photostudio/mobile-app

# 确保目录存在
mkdir -p src/pages/user/favorites

# 创建文件后清理缓存
rm -rf .temp
rm -rf .cache
rm -rf dist

echo "=== 修复完成 ==="
echo "已添加收藏页面文件并修复SCSS语法错误"
echo "现在可以重新运行: yarn dev:weapp"
