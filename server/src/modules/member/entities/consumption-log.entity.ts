import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('member_consumption_logs')
export class MemberConsumptionLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'consumption_time'
  })
  @ApiProperty({ description: '消费时间' })
  consumptionTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'settle_time',
    nullable: true 
  })
  @ApiProperty({ description: '结算时间' })
  settleTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
