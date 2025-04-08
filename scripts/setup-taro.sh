#!/bin/bash

# 清理现有目录和文件
rm -rf mobile-app
rm -rf photostudio
rm -rf .git
rm -f package-lock.json

# 创建新的目录结构
mkdir -p mobile-app
cd mobile-app

# 初始化package.json
cat > package.json << 'EOL'
{
  "name": "mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "影楼商城手机端",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "sass"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "build:h5": "taro build --type h5",
    "dev:weapp": "taro build --type weapp --watch",
    "dev:h5": "taro build --type h5 --watch"
  }
}
EOL

# 安装基础依赖
yarn add @tarojs/cli@4.0.9
yarn add react@18.0.0 react-dom@18.0.0 --exact
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact
yarn add @tarojs/components@4.0.9 --exact
yarn add @tarojs/taro@4.0.9 --exact

# 添加开发依赖
yarn add -D @types/react@18.0.0 --exact
yarn add -D sass@1.69.7 --exact

# 使用Taro CLI初始化项目
npx @tarojs/cli init . \
  --template=default \
  --typescript \
  --framework=react \
  --css=sass \
  --description="影楼商城手机端" \
  --projectName=photostudio-mobile

# 安装其他必要依赖
yarn add @tarojs/plugin-framework-react@4.0.9 --exact
yarn add @tarojs/runtime@4.0.9 --exact
yarn add @tarojs/shared@4.0.9 --exact

# 清理并重新安装
yarn cache clean
yarn install --force
