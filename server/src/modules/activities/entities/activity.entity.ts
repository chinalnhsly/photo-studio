import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  max_participants: number;

  @Column({ 
    type: 'timestamptz',
    name: 'event_date'
  })
  @ApiProperty({ description: '活动日期' })
  eventDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_start'
  })
  @ApiProperty({ description: '报名开始时间' })
  registrationStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_end'
  })
  @ApiProperty({ description: '报名结束时间' })
  registrationEnd: Date;

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
