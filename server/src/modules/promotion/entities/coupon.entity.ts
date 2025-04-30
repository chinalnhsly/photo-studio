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
import { Campaign } from './campaign.entity';
import { Product } from '../../product/entities/product.entity';
import { Category } from '../../product/entities/category.entity';
import { User } from '../../user/entities/user.entity';

export type CouponType = 'fixed' | 'percentage' | 'free_shipping' | 'gift';
export type CouponStatus = 'active' | 'used' | 'expired' | 'cancelled';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ nullable: true })
  campaignId: number;

  @ManyToOne(() => Campaign, campaign => campaign.coupons)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column({ 
    type: 'enum',
    enum: ['fixed', 'percentage', 'free_shipping', 'gift'],
    default: 'fixed'
  })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumPurchase: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ default: 1 })
  usageLimit: number;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isForNewUser: boolean;

  @Column({ default: false })
  isForMember: boolean;

  @Column({ nullable: true })
  memberLevelId: number;

  @Column({ 
    type: 'enum',
    enum: ['active', 'used', 'expired', 'cancelled'],
    default: 'active'
  })
  status: CouponStatus;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'coupon_products',
    joinColumn: { name: 'couponId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' }
  })
  products: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'coupon_categories',
    joinColumn: { name: 'couponId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: Category[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'coupon_users',
    joinColumn: { name: 'couponId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
