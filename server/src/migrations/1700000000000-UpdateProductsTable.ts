import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查表是否存在
    const tableExists = await queryRunner.hasTable('products');
    
    if (tableExists) {
      // 备份当前数据（如果有）
      await queryRunner.query(`CREATE TABLE products_backup AS SELECT * FROM products`);
      
      // 删除原表
      await queryRunner.dropTable('products');
    }
    
    // 创建新的产品表，结构与实体对应
    await queryRunner.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        stock INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        specifications JSONB,
        tags TEXT[],
        image_urls TEXT[],
        sale_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        promotion_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建索引
    await queryRunner.query(`CREATE INDEX idx_products_name ON products(name)`);
    await queryRunner.query(`CREATE INDEX idx_products_category ON products(category)`);
    
    // 如果有备份数据，导入可兼容的字段
    if (tableExists) {
      try {
        await queryRunner.query(`
          INSERT INTO products (name, description, price, stock, category, is_active, created_at, updated_at)
          SELECT name, description, price, stock, category, is_active, created_at, updated_at
          FROM products_backup
        `);
        // 导入完成后删除备份表
        await queryRunner.query(`DROP TABLE products_backup`);
      } catch (error) {
        console.error('Error migrating products data:', error);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE products`);
  }
}
