import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrdersTable1700000010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 添加新字段
    await queryRunner.query(`ALTER TABLE "orders" ADD "discount_amount" decimal(10,2) DEFAULT '0.00'`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "transaction_id" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "expire_time" timestamp`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "paid_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "appointment_date" timestamp`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "time_slot_id" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "customer_name" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "customer_phone" varchar(255)`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "remark" text`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "cancelled_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "cancel_reason" text`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "completed_at" timestamp`);
    
    // 确保索引命名统一
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_user" ON "orders" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除新添加的字段
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount_amount"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "transaction_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "expire_time"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paid_at"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "appointment_date"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "time_slot_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_name"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_phone"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "remark"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancelled_at"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancel_reason"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "completed_at"`);
    
    // 删除索引
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_user"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_status"`);
  }
}
