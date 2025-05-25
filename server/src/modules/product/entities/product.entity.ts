import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '商品ID' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: '商品名称' })
  name: string;

  @Column('text', { nullable: true })
  @ApiProperty({ description: '商品描述' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '商品价格' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ description: '商品原价' })
  originalPrice: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '折扣百分比' })
  discountPercent: number;

  @Column({ default: 0 })
  @ApiProperty({ description: '库存数量' })
  stock: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '商品分类' })
  category: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '商品图片URL' })
  imageUrl: string;

  // 添加图片数组字段
  @Column('text', { array: true, nullable: true, default: [] })
  @ApiProperty({ 
    description: '商品图片列表', 
    type: [String],
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  })
  images: string[];

  // 添加周末可用字段
  @Column({ default: true })
  @ApiProperty({ description: '周末是否可预约' })
  availableOnWeekends: boolean;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({ description: '所属分类' })
  categoryObj: Category;

  @Column({ nullable: true, name: 'category_id' })
  categoryId: number;

  @ManyToMany(() => Tag, tag => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  @ApiProperty({ description: '商品标签' })
  tags: Tag[];

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
