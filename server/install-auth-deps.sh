#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始安装 Auth 模块所需依赖...${NC}"

# 安装 JWT 相关依赖
echo -e "${GREEN}安装 JWT 相关依赖...${NC}"
npm install @nestjs/jwt jsonwebtoken
npm install --save-dev @types/jsonwebtoken

# 安装 Passport 相关依赖
echo -e "${GREEN}安装 Passport 相关依赖...${NC}"
npm install @nestjs/passport passport passport-jwt
npm install --save-dev @types/passport @types/passport-jwt

# 安装 bcrypt 和 uuid
echo -e "${GREEN}安装 bcrypt 和 uuid 依赖...${NC}"
npm install bcrypt uuid
npm install --save-dev @types/bcrypt @types/uuid

echo -e "${YELLOW}依赖安装完成!${NC}"
echo "请重新构建项目: npm run build"
