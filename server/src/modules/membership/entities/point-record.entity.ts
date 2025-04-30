import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export type PointRecordType = 'earn' | 'spend' | 'expire' | 'adjust';

@Entity('point_records')
export class PointRecord {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '记录ID' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'int' })
  @ApiProperty({ description: '积分变动值' })
  points: number;

  @Column({ type: 'enum', enum: ['earn', 'spend', 'expire', 'adjust'] })
  @ApiProperty({ description: '记录类型', enum: ['earn', 'spend', 'expire', 'adjust'] })
  type: PointRecordType;

  @Column()
  @ApiProperty({ description: '记录描述' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '关联订单号', required: false })
  orderNumber: string;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
