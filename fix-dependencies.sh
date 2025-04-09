#!/bin/bash

cd /home/liyong/photostudio/mobile-app

echo "=== 修复依赖问题 ==="

# 1. 使用兼容 Node.js 18 的 rimraf 版本
yarn add rimraf@3.0.2 --dev

# 2. 清理缓存，但不使用 yarn cache clean (可能会有问题)
echo "清理项目缓存"
rm -rf node_modules/.cache
rm -rf .temp
rm -rf dist

# 3. 修复图标文件 - 创建简单的占位图标
echo "生成临时图标文件"
mkdir -p src/assets/icons

# 生成最简单的1x1像素PNG图标
for icon in home home-active category category-active user user-active; do
  echo -e "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1F\x15\xC4\x89\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82" > src/assets/icons/$icon.png
done

echo "=== 修复完成，重新启动开发服务器 ==="
echo "yarn dev:weapp"
