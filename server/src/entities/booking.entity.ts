import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Photographer } from './photographer.entity';
import { BookingFile } from './booking-file.entity';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '预约ID' })
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id' })
  @ApiProperty({ description: '商品ID' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'time_slot_id', nullable: true })
  timeSlotId: number;

  @Column({ name: 'photographer_id', nullable: true })
  @ApiProperty({ description: '摄影师ID' })
  photographerId: number;
  
  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographer_id' })
  photographer: Photographer;

  @Column({ name: 'slot_id', nullable: true })
  slotId: number;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column({ name: 'booking_date', type: 'date', nullable: true })
  @ApiProperty({ description: '预约日期' })
  bookingDate: Date;

  @Column({ name: 'contact_name', nullable: true })
  @ApiProperty({ description: '联系人姓名' })
  contactName: string;

  @Column({ name: 'contact_phone', nullable: true })
  @ApiProperty({ description: '联系电话' })
  contactPhone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '备注' })
  notes: string;

  @Column({ default: 'pending' })
  @ApiProperty({ description: '状态' })
  status: BookingStatus;

  @OneToMany(() => BookingFile, file => file.booking)
  files: BookingFile[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
