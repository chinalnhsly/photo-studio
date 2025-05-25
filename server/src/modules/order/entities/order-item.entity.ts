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
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单项ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '订单ID' })
  orderId: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  @ApiProperty({ description: '商品ID' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 添加 name 字段，对应 product.name
  @Column()
  @ApiProperty({ description: '商品名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '商品图片' })
  productImage: string;

  // 添加 images 字段，存储多个图片
  @Column('text', { array: true, nullable: true })
  @ApiProperty({ description: '商品图片列表' })
  images: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '商品单价' })
  price: number;

  @Column()
  @ApiProperty({ description: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '总价' })
  totalPrice: number;

  // 添加 subtotal 字段作为 totalPrice 的别名
  @ApiProperty({ description: '小计金额' })
  get subtotal(): number {
    return Number(this.totalPrice);
  }

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
