#!/bin/bash

# 进入项目根目录
cd /home/liyong/photostudio

# 清理所有git相关内容
rm -rf .git .gitmodules
rm -rf mobile-app/.git server/.git

# 清理并重建mobile-app目录
cd mobile-app
rm -rf config/* src/* types/*

# 移动新创建的项目文件
cp -rf phtotoshopstudio/config/* config/
cp -rf phtotoshopstudio/src/* src/
cp -rf phtotoshopstudio/types/* types/
cp phtotoshopstudio/package.json .
cp phtotoshopstudio/tsconfig.json .
cp phtotoshopstudio/.eslintrc.js .
cp phtotoshopstudio/babel.config.js .

# 清理临时目录
rm -rf phtotoshopstudio

# 返回根目录并初始化git
cd ..
git init

# 创建.gitignore
cat > .gitignore << 'EOL'
node_modules/
dist/
.DS_Store
.env
*.log
.taro-cache/
package-lock.json
yarn.lock
EOL

# 初始化mobile-app
cd mobile-app
git init
git add .
git commit -m "Initial mobile app setup"

# 初始化server
cd ../server
git init
git add .
git commit -m "Initial server setup"

# 返回根目录
cd ..

# 设置git配置
git config user.name "chinalnhsly"
git config user.email "chinalnhsly@hotmail.com"

# 添加submodules
git submodule add ./mobile-app
git submodule add ./server

# 提交所有更改
git add .
git commit -m "Initial project setup with submodules"

# 安装依赖
cd mobile-app
yarn install

cd ../server
yarn install
