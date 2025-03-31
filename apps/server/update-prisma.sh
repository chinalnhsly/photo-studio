#!/bin/bash
# 为Prisma客户端创建必要的脚本

echo "开始更新Prisma模型..."

# 运行prisma generate生成客户端
pnpm prisma generate

# 使用db push同步数据库结构
pnpm prisma db push --accept-data-loss

# 可选: 查看数据库当前结构
# pnpm prisma db pull

echo "更新完成！"

# 使脚本可执行
chmod +x update-prisma.sh
