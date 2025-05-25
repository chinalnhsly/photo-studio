#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始更新用户表结构...${NC}"

# 连接到 postgres 执行 SQL
cat << EOF | psql -U postgres -d photostudio

-- 检查并修正用户表字段以匹配实体
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS contact_info VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS avatar VARCHAR NULL,
  ADD COLUMN IF NOT EXISTS preferences JSONB NULL,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE NULL;

-- 确保列名与实体定义匹配
DO \$\$
BEGIN
  -- 检查并重命名列（如果需要）
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isactive') THEN
    ALTER TABLE users RENAME COLUMN isactive TO is_active;
  END IF;
  
  -- 检查是否缺少is_active列
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
    ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END \$\$;

EOF

echo -e "${GREEN}用户表结构更新完成${NC}"
