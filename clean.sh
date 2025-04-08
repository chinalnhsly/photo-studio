#!/bin/bash

# 确保在正确的目录
cd /home/liyong/photostudio

# 删除所有git相关文件和目录
find . -name ".git" -type d -exec rm -rf {} +
rm -f .gitmodules

# 删除可能存在的嵌套项目
rm -rf photostudio/

# 初始化新的git仓库
git init

# 移动server目录内容到临时目录
mv server server_temp
rm -rf server
mkdir server
mv server_temp/* server/
rm -rf server_temp

# 更新.gitignore
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

# 重新添加所有文件
git add .

# 设置git配置
git config user.name "chinalnhsly"
git config user.email "chinalnhsly@hotmail.com"

# 提交更改
git commit -m "Initial clean setup"
