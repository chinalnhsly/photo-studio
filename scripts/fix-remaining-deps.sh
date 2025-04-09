#!/bin/bash

cd mobile-app

# 修改webpack-chain版本为6.5.1
yarn remove webpack-chain
yarn add webpack-chain@6.5.1

# 安装缺失的 peer dependency
yarn add @swc/types@0.1.5

# 移除重复的 react-refresh
yarn remove react-refresh
yarn add react-refresh@0.14.0 --dev

# 升级过时和不安全的包
yarn add rimraf@5.0.0
yarn add glob@10.3.10
yarn add eslint@latest
yarn add @eslint/config-array@latest
yarn add @eslint/object-schema@latest
yarn add acorn-import-attributes@latest

# 添加必要的依赖
yarn add memfs@4.6.0

# 重新构建和清理
yarn cache clean
yarn install --force

# 验证安装
echo "验证关键依赖版本："
yarn list @swc/types --depth=0
yarn list webpack-chain --depth=0
yarn list react-refresh --depth=0
