#!/bin/bash

# 确保在正确的目录
cd /home/liyong/photostudio

# 删除可能存在的git仓库
rm -rf .git
rm -rf photostudio/.git

# 初始化主git仓库
git init

# 创建基础目录结构
mkdir -p {mobile-app,web-app,admin-mobile,admin-web,server}/src

# 创建根目录package.json
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

# 创建.gitignore
cat > .gitignore << 'EOL'
node_modules/
dist/
.DS_Store
.env
*.log
.taro-cache/
coverage/
.idea/
.vscode/
EOL

# 初始化git提交
git add .
git config user.name "chinalnhsly"
git config user.email "chinalnhsly@hotmail.com"
git commit -m "Initial project setup"
