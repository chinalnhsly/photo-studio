import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sales_stats')
export class SalesStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;
}
