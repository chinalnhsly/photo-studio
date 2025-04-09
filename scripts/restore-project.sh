#!/bin/bash

# 确保在项目根目录
cd /home/liyong/photostudio

# 1. 还原基础目录结构
mkdir -p {mobile-app,server,docs,scripts}/src

# 2. 还原移动端项目结构
mkdir -p mobile-app/src/{assets,components,pages/{home,product,order,user},services,store,types}
mkdir -p mobile-app/src/components/{Banner,Calendar,CategoryGrid,ProductCard}
mkdir -p mobile-app/src/pages/home/components/{TopNav,CategoryNav,ProductList,AppointmentCard}
mkdir -p mobile-app/config

# 3. 执行git checkout恢复文件
git checkout HEAD -- .

# 4. 安装依赖
cd mobile-app
yarn install

# 5. 添加执行权限
cd ..
chmod +x scripts/*.sh
chmod +x *.sh

echo "项目文件恢复完成!"
