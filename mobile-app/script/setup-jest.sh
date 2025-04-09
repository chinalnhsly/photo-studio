#!/bin/bash

# 安装 Jest 相关依赖
yarn add -D @types/jest@^29.5.12 jest@^29.7.0 ts-jest@^29.1.2 --exact

# 清理缓存
rm -rf node_modules/.cache/typescript
rm -rf node_modules/.cache/jest

# 重新启动
yarn dev:weapp
