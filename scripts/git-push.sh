#!/bin/bash

# 设置错误时退出
set -e

echo "开始 Git 操作..."

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 获取远程更新
echo "获取远程更新..."
git fetch origin

# 尝试合并远程更改
echo "合并远程更改..."
git merge origin/main --allow-unrelated-histories || {
    echo "发生合并冲突，请手动解决后重新运行此脚本"
    exit 1
}

# 添加所有更改
echo "添加更改到暂存区..."
git add .

# 提交更改
echo "提交更改..."
git commit -m "merge: 合并远程仓库"

# 推送到远程
echo "推送到远程仓库..."
git push -u origin main

# 推送标签
echo "推送标签..."
git push origin v1.1.0

echo "Git 操作完成！"
