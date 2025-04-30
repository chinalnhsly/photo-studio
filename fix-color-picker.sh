#!/bin/bash

echo "=== 安装 react-color 依赖 ==="
cd admin-web
npm install react-color@2.19.3 @types/react-color --save

echo "=== 清理 Umi 缓存 ==="
rm -rf .umi
rm -rf src/.umi
rm -rf node_modules/.cache

echo "=== 完成! ==="
echo "请运行 npm start 重新启动项目"
