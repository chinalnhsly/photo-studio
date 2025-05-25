#!/bin/bash

echo "=== 安装 TypeScript 类型声明 ==="
cd admin-web
npm install --save-dev @types/webpack@4.41.32

echo "=== 清理类型缓存 ==="
rm -rf node_modules/.cache/typescript

echo "=== 完成 ==="
echo "类型声明安装完成，请重新启动开发服务器"
