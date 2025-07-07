import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('product_histories')
export class ProductHistory {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '历史记录ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '商品ID' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '价格' })
  price: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '描述' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '行为' })
  action: string;

  @Column({ nullable: true, name: 'modified_by' })
  @ApiProperty({ description: '修改人' })
  modifiedBy: string;

  @Column({ 
    type: 'timestamptz',
    name: 'change_time'
  })
  @ApiProperty({ description: '变更时间' })
  changeTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_from'
  })
  @ApiProperty({ description: '生效时间' })
  effectiveFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_to',
    nullable: true 
  })
  @ApiProperty({ description: '失效时间' })
  effectiveTo: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
