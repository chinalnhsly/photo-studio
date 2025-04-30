#!/bin/bash

echo "=== 修复 React Redux 版本冲突 ==="

# 删除 react-redux 9.x 版本
npm uninstall react-redux

# 安装 7.x 版本 (与 React 17 兼容)
npm install react-redux@7.2.9 --save-exact

# 安装其他兼容依赖
npm install use-sync-external-store@1.2.0 --save-exact

echo "=== 清理缓存 ==="
rm -rf admin-web/.umi
rm -rf admin-web/src/.umi

echo "=== 完成 ==="
echo "请尝试运行: npm run start:admin"
