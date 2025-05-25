#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始彻底清理项目...${NC}"

# 删除编译产物
rm -rf dist/
echo -e "${GREEN}已删除 dist 目录${NC}"

# 删除 node_modules
rm -rf node_modules/
rm -f package-lock.json
echo -e "${GREEN}已删除 node_modules 和 package-lock.json${NC}"

# 清除 Node.js 缓存
npm cache clean --force
echo -e "${GREEN}已清理 npm 缓存${NC}"

# 重新安装依赖
echo -e "${YELLOW}重新安装依赖...${NC}"
npm install --legacy-peer-deps

# 重新构建项目
echo -e "${YELLOW}重新构建项目...${NC}"
npm run build

echo -e "${GREEN}构建完成，现在可以启动项目:${NC}"
echo -e "${YELLOW}npm run start${NC}"
