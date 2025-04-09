#!/bin/bash

# 创建基础目录结构
mkdir -p photostudio/{mobile-app,web-app,admin-mobile,admin-web,server}/src

# 进入项目根目录
cd photostudio

# 创建全局配置文件
cat > package.json << 'EOL'
{
  "name": "photostudio",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "mobile-app",
    "web-app",
    "admin-mobile",
    "admin-web",
    "server"
  ]
}
EOL

# 创建Git忽略文件
cat > .gitignore << 'EOL'
node_modules/
dist/
.DS_Store
.env
*.log
.taro-cache/
coverage/
EOL

# 初始化Git仓库
git init
git add .
git commit -m "Initial project structure"
