import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '分类ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '分类名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '分类描述' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '父分类ID' })
  parentId: number;

  @Column({ default: 0 })
  @ApiProperty({ description: '排序序号' })
  sortOrder: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '分类图标' })
  icon: string;

  @OneToMany(() => Product, product => product.categoryObj)
  products: Product[];

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
