#!/bin/bash

# 确保在正确的目录
cd /home/liyong/photostudio

# 清理旧文件
rm -rf mobile-app/phtotoshopstudio
rm -rf mobile-app/node_modules

# 重新创建mobile-app目录
rm -rf mobile-app
mkdir mobile-app
cd mobile-app

# 初始化package.json
yarn init -y

# 安装Taro CLI
yarn add @tarojs/cli@4.0.9

# 使用Taro CLI创建项目
npx @tarojs/cli init --name=mobile-app \
  --description="影楼商城手机前端" \
  --typescript \
  --template=redux \
  --css=sass \
  --framework=react \
  --compiler=webpack5 \
  .

# 安装额外依赖
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact
yarn add @tarojs/plugin-framework-react@4.0.9 --exact

# 修改package.json
jq '.name = "mobile-app" | .private = true | .license = "MIT"' package.json > temp.json && mv temp.json package.json

# 安装依赖
yarn install

# 返回项目根目录
cd ..

# 初始化Git
git init
git add .
git commit -m "Initial project setup"
