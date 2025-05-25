import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../entities/user.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('user_view_histories')
export class UserViewHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ 
    type: 'timestamptz',
    name: 'viewed_at'
  })
  @ApiProperty({ description: '浏览时间' })
  viewedAt: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_view_time',
    nullable: true 
  })
  @ApiProperty({ description: '最近浏览时间' })
  lastViewTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
