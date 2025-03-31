#!/bin/bash
# 更新数据库脚本

cd /home/liyong/ps/photo-studio/apps/server

echo "=== 更新 Prisma 客户端 ==="
pnpm prisma generate

echo "=== 推送数据库结构变更 ==="
pnpm prisma db push

echo "数据库更新完成！"
