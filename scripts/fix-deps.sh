#!/bin/bash

# 清理依赖和锁文件
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# 重新安装依赖
yarn install --force

# 强制重新构建
yarn cache clean
yarn install
