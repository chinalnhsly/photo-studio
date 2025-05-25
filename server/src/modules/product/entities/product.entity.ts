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
  @ApiProperty({ description: '产品ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '产品名称' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '产品描述' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '价格' })
  price: number;

  @Column('text', { array: true, default: '{}' })
  @ApiProperty({ description: '产品图片', type: [String] })
  images: string[];

  @Column({ nullable: true })
  @ApiProperty({ description: '分类ID' })
  categoryId: number;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  categoryObj: Category;

  // 用于兼容代码中的 product.category 访问
  @ApiProperty({ description: '分类信息' })
  get category(): Category {
    return this.categoryObj;
  }

  @Column({ default: 0 })
  @ApiProperty({ description: '库存数量' })
  stock: number;

  @Column({ default: false })
  @ApiProperty({ description: '周末是否可用' })
  availableOnWeekends: boolean;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @ManyToMany(() => Tag, tag => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  @ApiProperty({ description: '产品标签', type: [Tag] })
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
