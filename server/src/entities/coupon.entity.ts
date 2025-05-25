import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  min_amount: number;

  @Column()
  valid_from: Date;

  @Column()
  valid_to: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
