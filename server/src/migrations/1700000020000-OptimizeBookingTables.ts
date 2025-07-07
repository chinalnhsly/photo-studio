import { MigrationInterface, QueryRunner } from 'typeorm';

export class OptimizeBookingTables1700000020000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 合并 time_slots 和 booking_slots 表
    await queryRunner.query(`
      ALTER TABLE booking_slots
      ADD COLUMN title VARCHAR(255),
      ADD COLUMN description TEXT
    `);
    
    // 创建索引优化查询性能
    await queryRunner.query(`CREATE INDEX idx_booking_slots_date ON booking_slots (date)`);
    await queryRunner.query(`CREATE INDEX idx_booking_slots_photographer ON booking_slots (photographer_id)`);
    await queryRunner.query(`CREATE INDEX idx_booking_slots_availability ON booking_slots (is_available)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除添加的字段和索引
    await queryRunner.query(`ALTER TABLE booking_slots DROP COLUMN IF EXISTS title`);
    await queryRunner.query(`ALTER TABLE booking_slots DROP COLUMN IF EXISTS description`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS idx_booking_slots_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_booking_slots_photographer`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_booking_slots_availability`);
  }
}
