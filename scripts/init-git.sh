#!/bin/bash

# 确保在正确的目录
cd /home/liyong/photostudio

# 初始化主仓库
git init
git add .
git commit -m "Initial commit"

# 初始化mobile-app子仓库
cd mobile-app
git init
git add .
git commit -m "Initial mobile app setup"

# 初始化server子仓库
cd ../server
git init
git add .
git commit -m "Initial server setup"

# 返回主目录
cd ..

# 添加子模块
git submodule add ./mobile-app
git submodule add ./server

# 提交子模块配置
git add .
git commit -m "Add submodules"
