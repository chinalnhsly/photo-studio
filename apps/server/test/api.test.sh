#!/bin/bash

BASE_URL="http://localhost:3000/api"  # 添加 /api 前缀
TOKEN=""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 测试用户注册
echo -e "\n${GREEN}测试用户注册...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}')
echo $REGISTER_RESPONSE

# 检查是否注册成功
if [[ $REGISTER_RESPONSE == *"id"* ]]; then
  echo -e "${GREEN}用户注册成功！${NC}"
else
  echo -e "${RED}用户注册失败：$REGISTER_RESPONSE${NC}"
fi

# 测试用户登录
echo -e "\n${GREEN}测试用户登录...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

# 提取 token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}登录成功！获取到 token${NC}"
else
  echo -e "${RED}登录失败：$LOGIN_RESPONSE${NC}"
  exit 1
fi

# 测试创建分类
echo -e "\n${GREEN}测试创建分类...${NC}"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"写真","description":"写真摄影服务"}')

echo $CATEGORY_RESPONSE
if [[ $CATEGORY_RESPONSE == *"id"* ]]; then
  echo -e "${GREEN}分类创建成功！${NC}"
  CATEGORY_ID=$(echo $CATEGORY_RESPONSE | jq -r '.id')
else
  echo -e "${RED}分类创建失败：$CATEGORY_RESPONSE${NC}"
  exit 1
fi

# 测试创建产品
echo -e "\n${GREEN}测试创建产品...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "情侣写真",
    "description": "浪漫情侣写真套餐",
    "price": "999",
    "categoryId": 1,
    "stock": 10
  }')

echo $PRODUCT_RESPONSE
if [[ $PRODUCT_RESPONSE == *"id"* ]]; then
  echo -e "${GREEN}产品创建成功！${NC}"
else
  echo -e "${RED}产品创建失败：$PRODUCT_RESPONSE${NC}"
fi

echo -e "\n${GREEN}测试完成！${NC}"
