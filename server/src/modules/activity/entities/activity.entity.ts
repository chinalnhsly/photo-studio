import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '活动ID' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: '活动名称' })
  name: string;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '活动开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time'
  })
  @ApiProperty({ description: '活动结束时间' })
  endTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_deadline',
    nullable: true 
  })
  @ApiProperty({ description: '报名截止时间' })
  registrationDeadline: Date;

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
