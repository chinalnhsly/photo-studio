#!/bin/bash

# 显示颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始完全重置数据库和迁移...${NC}"

# 1. 清理文件系统
echo -e "${GREEN}清理所有迁移文件和构建文件...${NC}"
rm -rf src/migrations/*
rm -rf dist/
echo -e "${GREEN}文件清理完成${NC}"

# 2. 完全重置数据库
echo -e "${BLUE}即将删除并重新创建数据库...${NC}"
echo -e "${RED}警告：这将删除所有数据！${NC}"
read -p "确认要继续吗？(y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "操作已取消"
    exit 0
fi

# 使用PostgreSQL管理员权限重建数据库
cat << EOF | sudo -u postgres psql
DROP DATABASE IF EXISTS photostudio;
CREATE DATABASE photostudio;
EOF

echo -e "${GREEN}数据库已重置${NC}"

# 3. 创建新的迁移文件，使用 Schema${TIMESTAMP} 作为文件名和类名
TIMESTAMP=$(date +%s%3N)
MIGRATION_FILE="src/migrations/${TIMESTAMP}-Schema.ts"
CLASS_NAME="Schema${TIMESTAMP}"

echo -e "${GREEN}创建新的迁移文件: ${MIGRATION_FILE}${NC}"

# 4. 创建新的迁移文件
cat > "${MIGRATION_FILE}" << EOF
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${CLASS_NAME} implements MigrationInterface {
    name = '${CLASS_NAME}'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('开始创建数据库结构...');

        // 创建用户表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "contact_info" VARCHAR(255),
                "role" VARCHAR(50) NOT NULL DEFAULT 'user',
                "avatar" VARCHAR(255),
                "phone" VARCHAR(50),
                "email" VARCHAR(255),
                "preferences" JSONB,
                "is_active" BOOLEAN DEFAULT TRUE,
                "last_login" TIMESTAMPTZ,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        \`);
        console.log('✓ 用户表创建成功');

        // 创建摄影师表
        await queryRunner.query(\`
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
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        \`);
        console.log('✓ 摄影师表创建成功');

        // 创建产品表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "products" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "price" DECIMAL(10,2) NOT NULL,
                "original_price" DECIMAL(10,2),
                "discount_percent" INTEGER,
                "stock" INTEGER DEFAULT 0,
                "category" VARCHAR(50),
                "images" TEXT[] DEFAULT '{}',
                "is_active" BOOLEAN DEFAULT TRUE,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        \`);
        console.log('✓ 产品表创建成功');

        // 创建时间段表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "time_slots" (
                "id" SERIAL PRIMARY KEY,
                "start_time" TIMESTAMPTZ NOT NULL,
                "end_time" TIMESTAMPTZ NOT NULL,
                "is_available" BOOLEAN DEFAULT TRUE,
                "title" VARCHAR(255),
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        \`);
        console.log('✓ 时间段表创建成功');

        // 创建预约时段表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "booking_slots" (
                "id" SERIAL PRIMARY KEY,
                "photographer_id" INTEGER,
                "date" DATE NOT NULL,
                "start_time" TIMESTAMPTZ NOT NULL,
                "end_time" TIMESTAMPTZ NOT NULL,
                "is_available" BOOLEAN DEFAULT TRUE,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_booking_slots_photographer"
                    FOREIGN KEY("photographer_id")
                    REFERENCES "photographers"("id")
                    ON DELETE SET NULL
            )
        \`);
        console.log('✓ 预约时段表创建成功');

        // 创建刷新令牌表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "refresh_tokens" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user_id" INTEGER NOT NULL,
                "token" VARCHAR(255) NOT NULL UNIQUE,
                "is_revoked" BOOLEAN DEFAULT FALSE,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "expires_at" TIMESTAMPTZ NOT NULL,
                "deleted_at" TIMESTAMPTZ,
                CONSTRAINT "fk_refresh_tokens_user"
                    FOREIGN KEY("user_id")
                    REFERENCES "users"("id")
                    ON DELETE CASCADE
            )
        \`);
        console.log('✓ 刷新令牌表创建成功');

        // 创建预约表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "bookings" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "product_id" INTEGER,
                "time_slot_id" INTEGER,
                "photographer_id" INTEGER,
                "slot_id" INTEGER,
                "start_time" TIMESTAMPTZ NOT NULL,
                "end_time" TIMESTAMPTZ NOT NULL,
                "booking_date" TIMESTAMPTZ NOT NULL,
                "contact_name" VARCHAR(255) NOT NULL,
                "contact_phone" VARCHAR(50) NOT NULL,
                "notes" TEXT,
                "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_bookings_user"
                    FOREIGN KEY("user_id")
                    REFERENCES "users"("id")
                    ON DELETE CASCADE,
                CONSTRAINT "fk_bookings_product"
                    FOREIGN KEY("product_id")
                    REFERENCES "products"("id")
                    ON DELETE SET NULL,
                CONSTRAINT "fk_bookings_photographer"
                    FOREIGN KEY("photographer_id")
                    REFERENCES "photographers"("id")
                    ON DELETE SET NULL,
                CONSTRAINT "fk_bookings_time_slot"
                    FOREIGN KEY("time_slot_id")
                    REFERENCES "time_slots"("id")
                    ON DELETE SET NULL,
                CONSTRAINT "fk_bookings_booking_slot"
                    FOREIGN KEY("slot_id")
                    REFERENCES "booking_slots"("id")
                    ON DELETE SET NULL
            )
        \`);
        console.log('✓ 预约表创建成功');

        // 创建预约文件表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "booking_files" (
                "id" SERIAL PRIMARY KEY,
                "booking_id" INTEGER NOT NULL,
                "file_name" VARCHAR(255) NOT NULL,
                "file_path" VARCHAR(255) NOT NULL,
                "file_type" VARCHAR(50) NOT NULL,
                "file_size" BIGINT,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_booking_files_booking"
                    FOREIGN KEY("booking_id")
                    REFERENCES "bookings"("id")
                    ON DELETE CASCADE
            )
        \`);
        console.log('✓ 预约文件表创建成功');

        // 创建订单表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "orders" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "order_number" VARCHAR(50) NOT NULL UNIQUE,
                "total_amount" DECIMAL(10,2) NOT NULL,
                "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
                "payment_method" VARCHAR(50),
                "notes" TEXT,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_orders_user"
                    FOREIGN KEY("user_id")
                    REFERENCES "users"("id")
                    ON DELETE CASCADE
            )
        \`);
        console.log('✓ 订单表创建成功');

        // 创建订单项目表
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "order_items" (
                "id" SERIAL PRIMARY KEY,
                "order_id" INTEGER NOT NULL,
                "product_id" INTEGER NOT NULL,
                "quantity" INTEGER NOT NULL DEFAULT 1,
                "price" DECIMAL(10,2) NOT NULL,
                "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_order_items_order"
                    FOREIGN KEY("order_id")
                    REFERENCES "orders"("id")
                    ON DELETE CASCADE,
                CONSTRAINT "fk_order_items_product"
                    FOREIGN KEY("product_id")
                    REFERENCES "products"("id")
                    ON DELETE SET NULL
            )
        \`);
        console.log('✓ 订单项目表创建成功');

        // 创建索引
        try {
            // 用户表索引
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users"("username")\`);
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role")\`);
            
            // 摄影师表索引
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_photographers_is_active" ON "photographers"("is_active")\`);
            
            // 产品表索引
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("category")\`);
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_products_is_active" ON "products"("is_active")\`);
            
            // 预约表索引
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_bookings_user_id" ON "bookings"("user_id")\`);
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_bookings_status" ON "bookings"("status")\`);
            
            // 订单表索引
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders"("user_id")\`);
            await queryRunner.query(\`CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders"("status")\`);
            
            console.log('✓ 索引创建成功');
        } catch (error) {
            console.error('索引创建时出现部分错误，但表结构创建成功');
            console.error(error);
        }

        console.log('✓ 数据库初始化完成!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 按照依赖关系反向删除表
        await queryRunner.query(\`DROP TABLE IF EXISTS "order_items"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "orders"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "booking_files"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "bookings"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "refresh_tokens"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "booking_slots"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "time_slots"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "products"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "photographers"\`);
        await queryRunner.query(\`DROP TABLE IF EXISTS "users"\`);
        
        console.log('✓ 所有表删除完成');
    }
}
EOF

# 5. 清理 node_modules 和 package-lock.json，然后重新安装和编译
echo -e "${GREEN}清理 node_modules 和 package-lock.json...${NC}"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}重新安装依赖...${NC}"
npm install --legacy-peer-deps # 使用 --legacy-peer-deps 以处理可能的依赖冲突
echo -e "${GREEN}开始编译项目 (确保 dist 目录被彻底清理)...${NC}"
rm -rf dist/ # 再次确保 dist 被清理
npm run build

# 6. 运行数据库迁移
echo -e "${BLUE}运行数据库迁移...${NC}"
# 明确指定使用编译后的 JS 文件进行迁移
npx typeorm-ts-node-commonjs migration:run -d dist/database/data-source.js

echo -e "${YELLOW}数据库重置和迁移过程完成!${NC}"
echo -e "${GREEN}现在可以启动应用程序了!${NC}"
