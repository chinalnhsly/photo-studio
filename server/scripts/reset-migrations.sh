#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始重置数据库和迁移...${NC}"

# 连接到PostgreSQL，清除迁移历史表
echo -e "${GREEN}清理数据库迁移历史...${NC}"
psql -U postgres -d photostudio -c "DROP TABLE IF EXISTS typeorm_migrations;"
echo -e "${GREEN}迁移历史清除完成${NC}"

# 删除所有迁移文件
echo -e "${GREEN}删除现有迁移文件...${NC}"
rm -f src/migrations/*.ts
echo -e "${GREEN}所有迁移文件已删除${NC}"

# 重建迁移目录
mkdir -p src/migrations
echo -e "${GREEN}迁移目录已重建${NC}"

# 清理构建文件
echo -e "${GREEN}清理构建文件...${NC}"
rm -rf dist/
echo -e "${GREEN}构建文件清理完成${NC}"

echo -e "${YELLOW}重置操作成功完成!${NC}"
echo -e "${YELLOW}接下来请执行:${NC}"
echo -e "${GREEN}npm run build${NC}"
echo -e "${GREEN}npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts${NC}"
