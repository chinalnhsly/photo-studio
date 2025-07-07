import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '标签ID' })
  id: number;

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '标签名称' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '标签描述' })
  description: string;

  @Column({ name: 'sort_order', default: 0 })
  @ApiProperty({ description: '排序顺序' })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ManyToMany(() => Product, product => product.tags)
  products: Product[];
}
