#!/bin/bash

# 清理现有环境
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json
rm -rf .taro-cache

# 更新 package.json
cat > package.json << 'EOL'
{
  "name": "@photostudio/mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "摄影工作室小程序",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "none"
  },
  "scripts": {
    "dev:weapp": "taro build --type weapp --watch",
    "build:weapp": "taro build --type weapp",
    "dev:h5": "taro build --type h5 --watch",
    "build:h5": "taro build --type h5"
  },
  "dependencies": {
    "@tarojs/cli": "4.0.9",
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/plugin-platform-weapp": "4.0.9",
    "@tarojs/react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "postcss": "8.4.35"
  },
  "devDependencies": {
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "@types/node": "18.0.0",
    "@types/webpack-env": "1.18.4",
    "sass": "1.69.7",
    "sass-loader": "13.3.0",
    "solid-js": "1.9.5",
    "typescript": "5.0.4"
  }
}
EOL

# 重新安装依赖
yarn install

# 清理缓存并重新构建
rm -rf dist
yarn build:weapp

echo "依赖冲突修复完成！"
