#!/bin/bash

cd mobile-app

# 降级TypeScript版本
yarn remove typescript
yarn add typescript@4.9.5 --dev

# 清理并重新安装依赖
yarn cache clean
yarn install

# 运行lint检查
yarn lint
