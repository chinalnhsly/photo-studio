#!/bin/bash

# 删除所有现有的git相关文件和目录
rm -rf .git
rm -rf mobile-app/.git
rm -rf server/.git
rm -rf .gitmodules

# 移动Taro项目文件到正确位置
mv mobile-app/phtotoshopstudio/* mobile-app/
rm -rf mobile-app/phtotoshopstudio

# 初始化主仓库
git init

# 创建.gitignore
cat > .gitignore << 'EOL'
node_modules/
dist/
.DS_Store
.env
*.log
.taro-cache/
EOL

# 初始化mobile-app
cd mobile-app
git init

# 添加mobile-app的文件
git add .
git commit -m "Initial mobile app setup"

# 初始化server
cd ../server
git init
git add .
git commit -m "Initial server setup"

# 返回主目录
cd ..

# 添加子模块
git submodule add ./mobile-app
git submodule add ./server

# 提交主仓库变更
git add .
git commit -m "Initial project setup with submodules"

# 设置git配置
git config --global user.name "chinalnhsly"
git config --global user.email "chinalnhsly@hotmail.com"
