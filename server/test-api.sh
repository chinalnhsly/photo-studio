#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
TOKEN=""

# 测试服务器健康状况
echo -e "${YELLOW}测试服务器健康状况...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL})
if [ $response -eq 200 ]; then
  echo -e "${GREEN}服务器运行正常 (${response})${NC}"
else
  echo -e "${RED}服务器可能存在问题 (${response})${NC}"
  exit 1
fi

# 登录获取令牌(如果有认证接口)
echo -e "${YELLOW}测试登录接口...${NC}"
if curl -s -X POST ${API_URL}/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' > /tmp/login_response.json; then
  TOKEN=$(cat /tmp/login_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  if [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}成功获取访问令牌${NC}"
  else
    echo -e "${RED}无法获取访问令牌${NC}"
    cat /tmp/login_response.json
  fi
else
  echo -e "${RED}登录请求失败${NC}"
fi

# 测试获取预约列表
echo -e "${YELLOW}测试获取预约列表...${NC}"
if [ ! -z "$TOKEN" ]; then
  AUTH_HEADER="Authorization: Bearer ${TOKEN}"
else
  AUTH_HEADER=""
fi

curl -s -X GET ${API_URL}/bookings -H "${AUTH_HEADER}" | jq . || echo -e "${RED}请求失败或jq未安装${NC}"

# 测试获取摄影师列表
echo -e "${YELLOW}测试获取摄影师列表...${NC}"
curl -s -X GET ${API_URL}/photographers -H "${AUTH_HEADER}" | jq . || echo -e "${RED}请求失败或jq未安装${NC}"

# 测试获取产品列表
echo -e "${YELLOW}测试获取产品列表...${NC}"
curl -s -X GET ${API_URL}/products -H "${AUTH_HEADER}" | jq . || echo -e "${RED}请求失败或jq未安装${NC}"

echo -e "${GREEN}API 测试完成${NC}"
