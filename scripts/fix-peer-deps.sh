#!/bin/bash

cd mobile-app

# 安装 peer dependencies
yarn add acorn@8 --dev
yarn add tslib@2 --dev
yarn add quill-delta@5 --dev
yarn add rxjs@7 --dev

# 降级 eslint 相关包到兼容版本
yarn remove eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
yarn add eslint@8.57.0 --dev
yarn add @typescript-eslint/eslint-plugin@6.21.0 --dev
yarn add @typescript-eslint/parser@6.21.0 --dev

# 添加缺失的依赖
yarn add @pmmmwh/react-refresh-webpack-plugin@0.5.16 --dev

# 清理并重新安装
yarn cache clean
yarn install --force

# 验证安装
echo "验证关键依赖版本："
yarn list eslint --depth=0
yarn list @typescript-eslint/eslint-plugin --depth=0
yarn list acorn --depth=0
yarn list tslib --depth=0
