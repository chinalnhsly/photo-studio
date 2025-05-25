#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始执行数据库迁移...${NC}"

# 清理旧的构建文件
echo -e "${GREEN}清理编译文件...${NC}"
rm -rf dist/
mkdir -p dist/migrations

# 编译项目
echo -e "${GREEN}编译项目...${NC}"
npm run build

# 执行表结构迁移
echo -e "${GREEN}创建数据库表结构...${NC}"
npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts

echo -e "${YELLOW}数据库迁移执行完成!${NC}"
