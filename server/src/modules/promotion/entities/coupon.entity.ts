import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from './campaign.entity';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Category } from '../../product/entities/category.entity';

export enum CouponType {
  FIXED = 'fixed',      // 固定金额优惠
  PERCENTAGE = 'percentage'  // 百分比优惠
}

export type CouponStatus = 'draft' | 'active' | 'used' | 'expired' | 'cancelled';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '优惠券ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '优惠券名称' })
  name: string;

  @Column()
  @ApiProperty({ description: '优惠券代码' })
  code: string;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.FIXED
  })
  @ApiProperty({ description: '优惠券类型', enum: CouponType })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '优惠券金额或百分比' })
  value: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: '百分比值（当类型为百分比时）' })
  percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: '最低消费金额' })
  minimumPurchase: number;

  // 添加与Campaign的关联
  @ManyToOne(() => Campaign, campaign => campaign.coupons)
  @JoinColumn({ name: 'campaign_id' })
  @ApiProperty({ description: '所属营销活动' })
  campaign: Campaign;

  // 添加外键列
  @Column({ nullable: true, name: 'campaign_id' })
  campaignId: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_date' 
  })
  @ApiProperty({ description: '生效时间' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_date' 
  })
  @ApiProperty({ description: '过期时间' })
  endDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_from',
    nullable: true 
  })
  @ApiProperty({ description: '开始生效时间' })
  validFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until',
    nullable: true 
  })
  @ApiProperty({ description: '结束生效时间' })
  validUntil: Date;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @Column({ default: -1 })
  @ApiProperty({ description: '使用次数限制，-1表示无限制' })
  usageLimit: number;

  @Column({ default: 0, name: 'used_count' })
  @ApiProperty({ description: '已使用次数' })
  usedCount: number;

  @Column({ 
    type: 'enum',
    enum: ['draft', 'active', 'used', 'expired', 'cancelled'],
    default: 'active'
  })
  @ApiProperty({ description: '优惠券状态' })
  status: CouponStatus;

  @Column({ default: false, name: 'is_for_new_user' })
  @ApiProperty({ description: '是否仅限新用户' })
  isForNewUser: boolean;

  @Column({ default: false, name: 'is_for_member' })
  @ApiProperty({ description: '是否仅限会员' })
  isForMember: boolean;

  @Column({ nullable: true, name: 'member_level_id' })
  @ApiProperty({ description: '会员等级要求' })
  memberLevelId: number;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'coupon_products',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  @ApiProperty({ description: '适用商品' })
  products: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'coupon_categories',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  @ApiProperty({ description: '适用商品类别' })
  categories: Category[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'coupon_users',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  @ApiProperty({ description: '指定可用用户' })
  users: User[];

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
