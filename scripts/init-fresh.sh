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
    "css": "less"
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
yarn add @tarojs/cli@4.0.9 --exact
yarn add react@18.0.0 react-dom@18.0.0 --exact
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact

# 添加开发依赖
yarn add -D @types/react@18.0.0 --exact
yarn add -D less@4.1.3 --exact

# 使用Taro CLI初始化项目
npx @tarojs/cli init . \
  --typescript \
  --template=default \
  --css=less \
  --framework=react \
  --description="影楼商城手机端"

# 返回根目录
cd ..

# 初始化Git仓库
git init
echo "node_modules/
dist/
.taro-cache/
.DS_Store
*.log
.env" > .gitignore

# 提交初始代码
git add .
git commit -m "Initial project setup"

# 设置Git配置
git config user.name "chinalnhsly"
git config user.email "chinalnhsly@hotmail.com"

# 清理并重新安装依赖
cd mobile-app
yarn cache clean
yarn install --force
