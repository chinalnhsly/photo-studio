#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "开始创建测试数据..."

psql -U postgres -d photostudio << EOF_SQL
-- 创建用户
INSERT INTO users (username, password, email, role)
VALUES
  ('admin', '$2b$10$0IKS0H1yxDTbYOhc1TkR8efZXKB3WrwLH3mUlHa8AIoZhAKlcdXdS', 'admin@example.com', 'admin'),
  ('user1', '$2b$10$0IKS0H1yxDTbYOhc1TkR8efZXKB3WrwLH3mUlHa8AIoZhAKlcdXdS', 'user1@example.com', 'user');

-- 创建分类
INSERT INTO categories (name, description)
VALUES
  ('婚纱摄影', '专业婚纱摄影服务'),
  ('写真摄影', '个人和家庭写真'),
  ('儿童摄影', '儿童主题摄影服务');

-- 创建产品
INSERT INTO products (name, description, price, stock, category_id)
VALUES
  ('经典婚纱套餐', '包含20张精修照片和4小时拍摄', 2999.00, 10, 1),
  ('个人写真精选', '包含10张精修照片和2小时拍摄', 999.00, 20, 2),
  ('儿童成长记录', '包含15张精修照片和玩具道具', 1299.00, 15, 3);
EOF_SQL

echo -e "测试数据创建完成"
