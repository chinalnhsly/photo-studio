#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始初始化数据库...${NC}"

# 使用 psql 创建基础表结构
echo -e "${GREEN}创建基础表结构...${NC}"

# 连接到 postgres 执行 SQL
cat << EOF | psql -U postgres -d photostudio

-- 确保扩展存在
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) NOT NULL DEFAULT 'user',
  "avatar" VARCHAR(255),
  "phone" VARCHAR(50),
  "email" VARCHAR(255),
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建摄影师表
CREATE TABLE IF NOT EXISTS "photographers" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "avatar" VARCHAR(255),
  "bio" TEXT,
  "biography" TEXT,
  "style" VARCHAR(255),
  "experience" INTEGER,
  "rating" DECIMAL(5,2) DEFAULT 5.0,
  "phone" VARCHAR(50),
  "email" VARCHAR(255),
  "is_active" BOOLEAN DEFAULT TRUE,
  "specialties" TEXT[] DEFAULT '{}',
  "portfolio_images" TEXT[] DEFAULT '{}',
  "equipments" TEXT[] DEFAULT '{}',
  "languages_spoken" VARCHAR(255),
  "accepts_rush_jobs" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "images" TEXT[] DEFAULT '{}',
  "stock" INTEGER NOT NULL DEFAULT 0,
  "available_on_weekends" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建时间段表
CREATE TABLE IF NOT EXISTS "time_slots" (
  "id" SERIAL PRIMARY KEY,
  "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "is_available" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建预约时段表
CREATE TABLE IF NOT EXISTS "booking_slots" (
  "id" SERIAL PRIMARY KEY,
  "photographer_id" INTEGER REFERENCES "photographers"("id") ON DELETE SET NULL,
  "date" DATE NOT NULL,
  "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "is_available" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建预约表
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" INTEGER REFERENCES "products"("id") ON DELETE SET NULL,
  "photographer_id" INTEGER REFERENCES "photographers"("id") ON DELETE SET NULL,
  "time_slot_id" INTEGER REFERENCES "time_slots"("id") ON DELETE SET NULL,
  "slot_id" INTEGER REFERENCES "booking_slots"("id") ON DELETE SET NULL,
  "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "booking_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "contact_name" VARCHAR(255) NOT NULL,
  "contact_phone" VARCHAR(50) NOT NULL,
  "notes" TEXT,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建预约文件表
CREATE TABLE IF NOT EXISTS "booking_files" (
  "id" SERIAL PRIMARY KEY,
  "booking_id" INTEGER NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
  "file_name" VARCHAR(255) NOT NULL,
  "file_path" VARCHAR(255) NOT NULL,
  "file_type" VARCHAR(50) NOT NULL,
  "file_size" BIGINT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "order_number" VARCHAR(50) NOT NULL UNIQUE,
  "total_amount" DECIMAL(10,2) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单项目表
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE SET NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "price" DECIMAL(10,2) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建刷新令牌表
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" VARCHAR(255) NOT NULL UNIQUE,
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品标签表
CREATE TABLE IF NOT EXISTS "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "description" VARCHAR,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品标签关联表
CREATE TABLE IF NOT EXISTS "product_tags" (
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("product_id", "tag_id")
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS "idx_photographers_is_active" ON "photographers"("is_active");
CREATE INDEX IF NOT EXISTS "idx_products_name" ON "products"("name");
CREATE INDEX IF NOT EXISTS "idx_bookings_user_id" ON "bookings"("user_id");
CREATE INDEX IF NOT EXISTS "idx_bookings_status" ON "bookings"("status");
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders"("user_id");
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "idx_tags_name" ON "tags"("name");
CREATE INDEX IF NOT EXISTS "idx_product_tags_product_id" ON "product_tags"("product_id");
CREATE INDEX IF NOT EXISTS "idx_product_tags_tag_id" ON "product_tags"("tag_id");

EOF

echo -e "${GREEN}数据库初始化完成${NC}"
echo -e "${YELLOW}你可以使用 synchronize: false 启动 NestJS 应用，避免 TypeORM 自动同步数据库结构${NC}"
