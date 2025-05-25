#!/bin/bash

echo "=== 修复路由组件加载问题 ==="

# 检查路由组件
node admin-web/scripts/check-route-components.js

# 清理缓存
echo "=== 清理缓存 ==="
rm -rf admin-web/.umi
rm -rf admin-web/src/.umi
rm -rf admin-web/node_modules/.cache

echo "=== 完成清理 ==="
echo "请启动项目: npm run start:admin"
