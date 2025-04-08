#!/bin/bash

cd mobile-app

# 移除所有eslint相关包
yarn remove eslint eslint-config-taro @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks

# 按正确的顺序重新安装eslint相关包
yarn add eslint@8.57.0 --dev
yarn add @typescript-eslint/parser@6.21.0 --dev
yarn add @typescript-eslint/eslint-plugin@6.21.0 --dev
yarn add eslint-config-taro@4.0.9 --dev
yarn add eslint-plugin-import@2.31.0 --dev
yarn add eslint-plugin-react@7.37.5 --dev
yarn add eslint-plugin-react-hooks@4.6.2 --dev

# 添加@babel/eslint-parser
yarn add @babel/eslint-parser@7.27.0 --dev

# 添加eslint配置文件
echo '{
  "extends": ["taro/react"],
  "rules": {}
}' > .eslintrc.js

# 清理并重新安装
yarn cache clean
yarn install --force

# 验证安装
echo "验证ESLint依赖版本："
yarn list eslint --depth=0
yarn list @typescript-eslint/parser --depth=0
yarn list @typescript-eslint/eslint-plugin --depth=0
