import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { BookingSlot } from './booking-slot.entity';
import { BookingFile } from './booking-file.entity';
import { TimeSlot } from './time-slot.entity'; // 导入 TimeSlot 实体
import { Photographer } from '../../photographer/entities/photographer.entity';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '预约ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  @ApiProperty({ description: '产品ID' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  @ApiProperty({ description: '摄影师ID' })
  photographerId: number;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographer_id' })
  photographer: Photographer;

  @Column({ nullable: true, name: 'time_slot_id' })
  @ApiProperty({ description: '时间段ID (旧版本兼容)' })
  timeSlotId: number;

  @ManyToOne(() => TimeSlot)
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot: TimeSlot;

  @Column({ nullable: true })
  @ApiProperty({ description: '预约时段ID' })
  slotId: number;

  @ManyToOne(() => BookingSlot)
  @JoinColumn({ name: 'slot_id' })
  slot: BookingSlot;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '预约日期' })
  bookingDate: Date;

  @Column()
  @ApiProperty({ description: '联系人姓名' })
  contactName: string;

  @Column()
  @ApiProperty({ description: '联系电话' })
  contactPhone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '备注' })
  notes: string;

  @Column({ 
    default: 'pending',
    type: 'varchar'
  })
  @ApiProperty({ description: '预约状态', enum: ['pending', 'confirmed', 'completed', 'cancelled'] })
  status: BookingStatus;

  @OneToMany(() => BookingFile, file => file.booking)
  files: BookingFile[];

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
