import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import { Coupon } from './coupon.entity';

export type CampaignType = 'discount' | 'flash_sale' | 'bundle' | 'gift' | 'free_shipping';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '活动ID' })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ description: '活动名称' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '活动描述' })
  description: string;

  @Column({ 
    type: 'enum',
    enum: ['discount', 'flash_sale', 'bundle', 'gift', 'free_shipping'],
    default: 'discount'
  })
  type: CampaignType;

  @Column({ 
    type: 'enum',
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  })
  status: CampaignStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumPurchase: number;

  @Column({ 
    type: 'timestamptz',  // 已经修改为 PostgreSQL 支持的类型
    name: 'start_date',
    nullable: true
  })
  @ApiProperty({ description: '活动开始时间' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',  // 已经修改为 PostgreSQL 支持的类型
    name: 'end_date',
    nullable: true
  })
  @ApiProperty({ description: '活动结束时间' })
  endDate: Date;

  @Column({ nullable: true })
  usage_limit: number;

  @Column({ default: 0 })
  used_count: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  isForNewUser: boolean;

  @Column({ default: false })
  isForMember: boolean;

  @Column({ nullable: true })
  memberLevelId: number;

  @Column({ type: 'json', nullable: true })
  rules: any;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'campaign_products',
    joinColumn: { name: 'campaignId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' }
  })
  products: Product[];

  @OneToMany(() => Coupon, coupon => coupon.campaign)
  coupons: Coupon[];

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
