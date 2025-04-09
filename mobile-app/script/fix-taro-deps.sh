#!/bin/bash

# 清理环境
rm -rf node_modules
rm -f yarn.lock
rm -rf dist

# 安装全局 Taro CLI
yarn global add @tarojs/cli@4.0.9

# 安装项目依赖
yarn add -D @tarojs/cli@4.0.9 \
  @tarojs/service@4.0.9 \
  @tarojs/mini-runner@4.0.9 \
  @tarojs/webpack-runner@4.0.9 \
  babel-preset-taro@4.0.9 \
  eslint-config-taro@4.0.9 \
  --exact

# 安装核心依赖
yarn add @tarojs/taro@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/react@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  @tarojs/plugin-platform-weapp@4.0.9 \
  @tarojs/helper@4.0.9 \
  @tarojs/service@4.0.9 \
  @tarojs/shared@4.0.9 \
  --exact

# 更新package.json中的依赖版本
cat > package.json << 'EOL'
{
  "name": "@photostudio/mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "摄影工作室小程序",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "scss"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "dev:weapp": "taro build --type weapp --watch"
  },
  "dependencies": {
    "@babel/runtime": "7.23.9",
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/plugin-platform-weapp": "4.0.9",
    "@tarojs/react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@babel/core": "7.23.9",
    "@babel/preset-env": "7.23.9",
    "@babel/preset-react": "7.23.3",
    "@babel/preset-typescript": "7.23.3",
    "@types/react": "18.2.0",
    "@types/webpack-env": "1.18.4",
    "babel-preset-taro": "4.0.9",
    "eslint": "8.56.0",
    "postcss": "8.4.18",
    "sass": "1.69.7",
    "typescript": "5.3.3"
  }
}
EOL

# 重新安装依赖
yarn install --force

# 重新构建
yarn build:weapp

echo "Taro 依赖修复完成！"
