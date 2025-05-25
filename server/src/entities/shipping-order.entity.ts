import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('shipping_orders')
export class ShippingOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  express_company: string;

  @Column()
  tracking_number: string;

  @Column()
  status: string; // pending, shipped, delivered, exception

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn()
  created_at: Date;
}
