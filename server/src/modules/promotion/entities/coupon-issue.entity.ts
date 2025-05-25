import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('coupon_issues')
export class CouponIssue {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'issue_date'
  })
  @ApiProperty({ description: '发放日期' })
  issueDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until'
  })
  @ApiProperty({ description: '有效期至' })
  validUntil: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'used_at',
    nullable: true 
  })
  @ApiProperty({ description: '使用时间' })
  usedAt: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
