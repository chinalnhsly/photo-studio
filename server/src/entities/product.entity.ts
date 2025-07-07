import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../modules/order/entities/order-item.entity';
import { Tag } from './tag.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '商品ID' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: '商品名称' })
  @Index()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: '商品价格' })
  price: number;

  @Column('decimal', { name: 'original_price', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ description: '原价', required: false })
  originalPrice: number;

  @Column('decimal', { name: 'discount_percent', precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: '折扣百分比', required: false })
  discountPercent: number;

  @Column('text')
  @ApiProperty({ description: '商品描述' })
  description: string;

  @Column()
  @ApiProperty({ description: '商品主图' })
  image: string;

  @Column('int')
  @ApiProperty({ description: '库存数量' })
  stock: number;

  @Column()
  @ApiProperty({ description: '商品分类', example: 'wedding' })
  @Index()
  category: string;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: '是否上架', default: true })
  isActive: boolean;

  @Column({ name: 'images', nullable: true, type: 'simple-array' })
  @ApiProperty({ description: '图片集', required: false })
  images: string[];

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: '商品规格', required: false })
  specifications: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'product_tags',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
