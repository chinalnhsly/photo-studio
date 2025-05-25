#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始更新数据库...${NC}"

# 连接到 postgres 执行 SQL
cat << EOF | psql -U postgres -d photostudio

-- 创建支付表
CREATE TABLE IF NOT EXISTS "payments" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "amount" INTEGER NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "transaction_id" VARCHAR(255),
  "payment_time" TIMESTAMP WITH TIME ZONE,
  "expire_time" TIMESTAMP WITH TIME ZONE,
  "refund_time" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_payments_order_id" ON "payments"("order_id");
CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "idx_payments_transaction_id" ON "payments"("transaction_id");

EOF

echo -e "${GREEN}数据库更新完成${NC}"
