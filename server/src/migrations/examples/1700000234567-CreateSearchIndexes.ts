import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 该迁移用于创建全文搜索索引，提升查询性能
 */
export class CreateSearchIndexes1700000234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 为产品表添加全文搜索
    await queryRunner.query(`
      -- 添加全文搜索向量列
      ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

      -- 创建更新函数
      CREATE OR REPLACE FUNCTION product_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := 
            setweight(to_tsvector('chinese', COALESCE(NEW.name, '')), 'A') || 
            setweight(to_tsvector('chinese', COALESCE(NEW.description, '')), 'B') ||
            setweight(to_tsvector('chinese', COALESCE(NEW.category, '')), 'C');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      -- 初始化现有数据
      UPDATE products SET search_vector = 
          setweight(to_tsvector('chinese', COALESCE(name, '')), 'A') || 
          setweight(to_tsvector('chinese', COALESCE(description, '')), 'B') ||
          setweight(to_tsvector('chinese', COALESCE(category, '')), 'C');

      -- 创建触发器
      DROP TRIGGER IF EXISTS product_search_update ON products;
      CREATE TRIGGER product_search_update 
      BEFORE INSERT OR UPDATE ON products 
      FOR EACH ROW EXECUTE FUNCTION product_search_trigger();

      -- 创建GIN索引 (并发创建以减少锁定)
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search 
      ON products USING gin(search_vector);
    `);

    // 为摄影师表添加全文搜索
    await queryRunner.query(`
      -- 添加全文搜索向量列
      ALTER TABLE photographers ADD COLUMN IF NOT EXISTS search_vector tsvector;

      -- 创建更新函数
      CREATE OR REPLACE FUNCTION photographer_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := 
            setweight(to_tsvector('chinese', COALESCE(NEW.name, '')), 'A') || 
            setweight(to_tsvector('chinese', COALESCE(NEW.bio, '')), 'B') ||
            setweight(to_tsvector('chinese', COALESCE(NEW.style, '')), 'C');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;

      -- 初始化现有数据
      UPDATE photographers SET search_vector = 
          setweight(to_tsvector('chinese', COALESCE(name, '')), 'A') || 
          setweight(to_tsvector('chinese', COALESCE(bio, '')), 'B') ||
          setweight(to_tsvector('chinese', COALESCE(style, '')), 'C');

      -- 创建触发器
      DROP TRIGGER IF EXISTS photographer_search_update ON photographers;
      CREATE TRIGGER photographer_search_update 
      BEFORE INSERT OR UPDATE ON photographers 
      FOR EACH ROW EXECUTE FUNCTION photographer_search_trigger();

      -- 创建GIN索引 (并发创建以减少锁定)
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_photographers_search 
      ON photographers USING gin(search_vector);
    `);

    // 添加其他常用索引
    await queryRunner.query(`
      -- 订单创建时间索引 (用于报表查询)
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

      -- 用户类型索引 (用于按角色过滤)
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 移除产品表全文搜索
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS product_search_update ON products;
      DROP INDEX IF EXISTS idx_products_search;
      DROP FUNCTION IF EXISTS product_search_trigger();
      ALTER TABLE products DROP COLUMN IF EXISTS search_vector;
    `);

    // 移除摄影师表全文搜索
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS photographer_search_update ON photographers;
      DROP INDEX IF EXISTS idx_photographers_search;
      DROP FUNCTION IF EXISTS photographer_search_trigger();
      ALTER TABLE photographers DROP COLUMN IF EXISTS search_vector;
    `);

    // 移除其他添加的索引
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_orders_created_at;
      DROP INDEX IF EXISTS idx_users_role;
    `);
  }
}
