import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单项ID' })
  id: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  @ApiProperty({ description: '商品名称' })
  productName: string;

  @Column()
  @ApiProperty({ description: '商品图片' })
  productImage: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty({ description: '商品价格' })
  price: number;

  @Column()
  @ApiProperty({ description: '购买数量' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty({ description: '小计金额' })
  subtotal: number;
}
