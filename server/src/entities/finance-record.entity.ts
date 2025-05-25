import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('finance_records')
export class FinanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  type: string; // income, refund, expense

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('text', { nullable: true })
  remark: string;

  @CreateDateColumn()
  created_at: Date;
}
