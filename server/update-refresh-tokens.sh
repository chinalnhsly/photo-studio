#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始更新refresh_tokens表结构...${NC}"

# 连接到 postgres 执行 SQL
cat << EOF | psql -U postgres -d photostudio

-- 检查refresh_tokens表是否存在，不存在则创建
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'refresh_tokens') THEN
    CREATE TABLE "refresh_tokens" (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "token" VARCHAR(255) NOT NULL UNIQUE,
      "is_revoked" BOOLEAN NOT NULL DEFAULT false,
      "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "deleted_at" TIMESTAMP WITH TIME ZONE
    );
  ELSE
    -- 检查字段是否存在，若不存在则添加
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'user_id') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'token') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "token" VARCHAR(255) NOT NULL UNIQUE DEFAULT uuid_generate_v4()::text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'is_revoked') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "is_revoked" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'expires_at') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + interval '7 day');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'created_at') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'deleted_at') THEN
      ALTER TABLE "refresh_tokens" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- 检查字段是否重命名 - userId 改为 user_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'userid') THEN
      ALTER TABLE "refresh_tokens" RENAME COLUMN "userid" TO "user_id";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'userId') THEN
      ALTER TABLE "refresh_tokens" RENAME COLUMN "userId" TO "user_id";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'isrevoked') THEN
      ALTER TABLE "refresh_tokens" RENAME COLUMN "isrevoked" TO "is_revoked";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'refresh_tokens' AND column_name = 'expiresat') THEN
      ALTER TABLE "refresh_tokens" RENAME COLUMN "expiresat" TO "expires_at";
    END IF;
  END IF;
END \$\$;

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user_id" ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_token" ON "refresh_tokens"("token");

EOF

echo -e "${GREEN}refresh_tokens表结构更新完成${NC}"
