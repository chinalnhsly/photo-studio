#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}启动影楼商城服务器...${NC}"

# 检查数据库连接
echo -e "${BLUE}检查数据库连接...${NC}"
pg_isready -h localhost -U postgres -d photostudio && echo -e "${GREEN}数据库连接正常${NC}" || echo -e "${RED}数据库连接失败${NC}"

# 启动服务器
echo -e "${BLUE}启动 NestJS 服务器...${NC}"
npm run start:dev

# 退出时的清理工作
function cleanup() {
  echo -e "${YELLOW}正在关闭服务器...${NC}"
  kill $(lsof -t -i:3000) 2>/dev/null || true
  echo -e "${GREEN}服务器已关闭${NC}"
}

# 注册信号处理器
trap cleanup SIGINT SIGTERM

# 保持脚本运行
wait
