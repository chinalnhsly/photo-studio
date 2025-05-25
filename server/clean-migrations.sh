#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始清理迁移文件...${NC}"

# 删除所有迁移文件
rm -f src/migrations/*.ts
echo -e "${GREEN}已删除所有迁移文件${NC}"

# 删除编译后的迁移文件
rm -rf dist/migrations
echo -e "${GREEN}已删除编译后的迁移文件${NC}"

# 重建迁移目录
mkdir -p src/migrations
mkdir -p dist/migrations
echo -e "${GREEN}已重建迁移目录${NC}"

echo -e "${YELLOW}迁移文件清理完成!${NC}"
echo -e "${YELLOW}接下来请执行:${NC}"
echo -e "${GREEN}npm run build${NC}"
echo -e "${GREEN}npx typeorm-ts-node-commonjs migration:generate src/migrations/InitialSchema -d src/database/data-source.ts${NC}"
