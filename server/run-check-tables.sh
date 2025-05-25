#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始检查数据库表结构...${NC}"

# 清理旧的构建文件
rm -rf dist/
npm run build

# 执行数据库结构检查
echo -e "${GREEN}运行检查脚本...${NC}"
npx ts-node src/migrations/check-tables.ts

echo -e "${YELLOW}数据库表结构检查完成!${NC}"
