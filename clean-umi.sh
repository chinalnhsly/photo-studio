#!/bin/bash

echo "=== 清理 Umi 缓存 ==="
rm -rf admin-web/.umi
rm -rf admin-web/src/.umi
rm -rf admin-web/node_modules/.cache

echo "=== 缓存清理完成 ==="
echo "请运行 npm run start:admin 重新启动项目"
