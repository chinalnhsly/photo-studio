import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Photographer } from '../../photographer/entities/photographer.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  photographerId: number;

  @Column({ 
    type: 'timestamptz',
    name: 'appointment_date'
  })
  @ApiProperty({ description: '预约日期' })
  appointmentDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'confirm_time',
    nullable: true 
  })
  @ApiProperty({ description: '确认时间' })
  confirmTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'cancel_time',
    nullable: true 
  })
  @ApiProperty({ description: '取消时间' })
  cancelTime: Date;

  @Column({ type: 'int' })
  timeSlotId: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time'
  })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  remark: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'int' })
  productId: number;

  @Column({ 
    type: 'timestamptz',
    name: 'cancelled_at',
    nullable: true 
  })
  @ApiProperty({ description: '取消时间' })
  cancelledAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographerId' })
  photographer: Photographer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

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
