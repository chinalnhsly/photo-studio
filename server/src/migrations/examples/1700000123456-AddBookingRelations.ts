import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 该迁移用于添加预约与摄影师的关联关系
 */
export class AddBookingRelations1700000123456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查表是否存在
    const tableExists = await queryRunner.hasTable('bookings');
    if (!tableExists) {
      console.log('Bookings table does not exist. Creating table...');
      
      // 创建预约表
      await queryRunner.query(`
        CREATE TABLE "bookings" (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          booking_date DATE NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
      
      // 添加索引
      await queryRunner.query(`CREATE INDEX "idx_bookings_user" ON "bookings" ("user_id")`);
      await queryRunner.query(`CREATE INDEX "idx_bookings_date" ON "bookings" ("booking_date")`);
    }

    // 检查是否已有摄影师关联字段
    const hasPhotographerColumn = await queryRunner.hasColumn('bookings', 'photographer_id');
    if (!hasPhotographerColumn) {
      console.log('Adding photographer relationship to bookings table...');
      
      // 添加摄影师外键
      await queryRunner.query(`ALTER TABLE "bookings" ADD "photographer_id" INTEGER`);
      await queryRunner.query(`CREATE INDEX "idx_bookings_photographer" ON "bookings" ("photographer_id")`);
      
      // 添加外键约束前检查数据一致性
      console.log('Checking data integrity before adding foreign key...');
      const photographersExist = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM "photographers" LIMIT 1
        )
      `);
      
      if (photographersExist[0].exists) {
        await queryRunner.query(`
          ALTER TABLE "bookings" 
          ADD CONSTRAINT "fk_bookings_photographer" 
          FOREIGN KEY ("photographer_id") 
          REFERENCES "photographers"("id")
        `);
      } else {
        console.log('Photographers table is empty. Foreign key will be added in a future migration.');
      }
    }

    // 添加更多预约相关字段
    const hasStartTimeColumn = await queryRunner.hasColumn('bookings', 'start_time');
    if (!hasStartTimeColumn) {
      await queryRunner.query(`ALTER TABLE "bookings" ADD "start_time" TIME`);
      await queryRunner.query(`ALTER TABLE "bookings" ADD "end_time" TIME`);
      await queryRunner.query(`ALTER TABLE "bookings" ADD "notes" TEXT`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 移除外键约束
    try {
      await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "fk_bookings_photographer"`);
    } catch (error) {
      console.log('Foreign key constraint may not exist. Continuing...');
    }
    
    // 移除添加的字段
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "start_time"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "end_time"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "notes"`);
    
    // 移除索引和字段
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_bookings_photographer"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN IF EXISTS "photographer_id"`);
  }
}
