import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '标签ID' })
  id: number;

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '标签名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '标签描述' })
  description: string;

  @Column({ default: 0 })
  @ApiProperty({ description: '排序权重' })
  sortOrder: number;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ManyToMany(() => Product, product => product.tags)
  products: Product[];
}
