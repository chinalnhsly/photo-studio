#!/bin/bash

echo "=== 清理依赖和缓存 ==="
rm -rf node_modules
rm -rf admin-web/node_modules
rm -rf admin-web/.umi
rm -rf admin-web/src/.umi
rm -rf mobile-app/node_modules
rm -f package-lock.json
rm -f admin-web/package-lock.json
rm -f mobile-app/package-lock.json

echo "=== 安装依赖 ==="
# 使用 --no-package-lock 避免生成 package-lock.json，可能导致版本冲突
npm install --force

echo "=== 验证 React 版本 ==="
npm ls react

echo "=== 完成! ==="
echo "请使用 'npm run start:admin' 启动管理后台"
