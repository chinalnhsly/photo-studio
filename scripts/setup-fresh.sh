#!/bin/bash

# 进入工作目录
cd /home/liyong/photostudio

# 清理所有现有文件和目录
rm -rf mobile-app
rm -rf .git
rm -f package.json yarn.lock

# 创建新的目录结构
mkdir -p mobile-app
cd mobile-app

# 初始化新的package.json
cat > package.json << 'EOL'
{
  "name": "mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "影楼商城手机端",
  "author": "chinalnhsly",
  "scripts": {
    "dev:weapp": "taro build --type weapp --watch",
    "build:weapp": "taro build --type weapp",
    "dev:h5": "taro build --type h5 --watch",
    "build:h5": "taro build --type h5"
  }
}
EOL

# 安装基础依赖
yarn add @tarojs/cli@4.0.9 --exact
yarn add react@18.0.0 react-dom@18.0.0 --exact

# 创建Taro项目
npx @tarojs/cli init . \
  --typescript \
  --framework=react \
  --template=default \
  --css=sass \
  --description="影楼商城手机端"

# 安装Redux相关依赖
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact
yarn add @tarojs/plugin-framework-react@4.0.9 --exact

# 返回主目录并初始化Git
cd ..
git init

# 创建.gitignore
cat > .gitignore << 'EOL'
node_modules/
dist/
.taro-cache/
.DS_Store
*.log
.env
EOL

# 提交初始代码
git add .
git commit -m "Initial project setup"

# 安装依赖
cd mobile-app
yarn install
