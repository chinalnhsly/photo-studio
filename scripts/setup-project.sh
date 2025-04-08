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
    "css": "stylus"
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
yarn add @tarojs/cli@4.0.9 \
  @tarojs/taro@4.0.9 \
  @tarojs/components@4.0.9 \
  @tarojs/helper@4.0.9 \
  @tarojs/shared@4.0.9 \
  @tarojs/runtime@4.0.9 \
  @tarojs/plugin-framework-react@4.0.9 \
  postcss@8.4.18 \
  react@18.0.0 \
  react-dom@18.0.0 \
  @reduxjs/toolkit@1.9.7 \
  react-redux@8.1.3

# 初始化Git仓库
cd ..
git init
echo "node_modules/
dist/
.taro-cache/
.DS_Store
*.log" > .gitignore

git add .
git config --global user.name "chinalnhsly"
git config --global user.email "chinalnhsly@hotmail.com"
git commit -m "Initial project setup"

# 清理缓存并重新安装依赖
cd mobile-app
yarn cache clean
yarn install --force
