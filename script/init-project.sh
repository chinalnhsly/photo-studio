#!/bin/bash

# 创建项目目录结构
mkdir -p mobile-app/src
mkdir -p server/src

# 初始化Git仓库
git init

# 创建.gitignore文件
cat > .gitignore << 'EOL'
node_modules/
dist/
.DS_Store
.env
*.log
EOL

# 初始化mobile-app项目
cd mobile-app
git init
yarn init -y
yarn add @tarojs/cli@4.0.9

# 使用Taro CLI创建项目
npx @tarojs/cli init .

# 返回主目录
cd ..

# 初始化server项目
cd server
git init
yarn init -y

# 添加初始提交
git add .
git commit -m "Initial commit"

# 设置Git配置
git config --global user.name "chinalnhsly"
git config --global user.email "chinalnhsly@hotmail.com"
