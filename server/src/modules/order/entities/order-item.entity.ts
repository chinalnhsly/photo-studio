import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../../entities/order.entity';
import { Product } from '../../../entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单项ID' })
  id: number;

  @Column({ name: 'order_id' })
  @ApiProperty({ description: '订单ID' })
  orderId: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id' })
  @ApiProperty({ description: '商品ID' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  @ApiProperty({ description: '数量' })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: '商品单价' })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: '小计金额' })
  subtotal: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '规格信息' })
  specifications: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '备注信息' })
  remark: string;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamptz',
    name: 'updated_at'
  })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
