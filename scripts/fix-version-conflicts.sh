#!/bin/bash

cd mobile-app

# 清除已有的 node_modules
rm -rf node_modules
rm -f yarn.lock

# 安装特定版本的依赖
yarn add @swc/core@1.4.13
yarn add react-refresh@0.14.0
yarn add @swc-node/core@latest

# 重新安装所有依赖
yarn install --force

# 验证特定包的版本
echo "检查安装的版本："
yarn list @swc/core --depth=0
yarn list react-refresh --depth=0
yarn list @swc-node/core --depth=0
