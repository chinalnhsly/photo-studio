#!/bin/bash

# 确保在正确目录
cd /home/liyong/photostudio

# 删除所有 package-lock.json 文件
find . -name "package-lock.json" -type f -delete

# 删除所有 node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# 清理 yarn 缓存
yarn cache clean

# 重新安装依赖
yarn install

# 给予执行权限
chmod +x clean-deps.sh
