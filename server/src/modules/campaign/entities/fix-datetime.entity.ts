import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDatetimeTypes1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 修改所有 datetime 类型为 timestamptz
        await queryRunner.query(`
            ALTER TABLE campaigns
            ALTER COLUMN start_date TYPE timestamptz,
            ALTER COLUMN end_date TYPE timestamptz,
            ALTER COLUMN created_at TYPE timestamptz,
            ALTER COLUMN updated_at TYPE timestamptz
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 回滚修改
        await queryRunner.query(`
            ALTER TABLE campaigns
            ALTER COLUMN start_date TYPE timestamp,
            ALTER COLUMN end_date TYPE timestamp,
            ALTER COLUMN created_at TYPE timestamp,
            ALTER COLUMN updated_at TYPE timestamp
        `);
    }
}
