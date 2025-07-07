import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
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
  @ApiProperty({ description: '排序序号' })
  sortOrder: number;

  @ManyToMany(() => Product, product => product.tags)
  products: Product[];

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
