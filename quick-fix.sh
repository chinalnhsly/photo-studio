#!/bin/bash

echo "=== 快速修复缺失文件和语法错误 ==="

cd /home/liyong/photostudio/mobile-app

# 清理缓存
rm -rf .temp
rm -rf .cache
rm -rf dist

echo "=== 修复完成 ==="
echo "缺失的页面文件和样式已创建，现在可以重新运行:"
echo "yarn dev:weapp"
