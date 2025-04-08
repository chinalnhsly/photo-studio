#!/bin/bash

# 确保在正确的目录
cd /home/liyong/photostudio

# 1. 整理目录结构
mkdir -p {mobile-app,server,docs,scripts}/src

# 2. 移动文件到正确位置
# 移动脚本文件
mv script/* scripts/
rmdir script

# 移动文档文件
mv *.md docs/

# 3. 清理不必要的文件
rm -f src/store/reducers/counter.ts
rm -rf photostudio

# 4. 创建新的.gitignore
cat > .gitignore << 'EOL'
# Dependencies
node_modules/
.pnp/
.pnp.js

# Production
dist/
build/
lib/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.idea/
.vscode/
*.sublime-*

# OS
.DS_Store
Thumbs.db

# Taro
.taro-cache/
.temp/
.rn_temp/

# Testing
coverage/

# Misc
*.log
EOL

# 5. 提交更改
git add .
git commit -m "chore: reorganize project structure"
