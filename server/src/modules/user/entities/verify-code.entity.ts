import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('verify_codes')
export class VerifyCode {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'issue_time'
  })
  @ApiProperty({ description: '发送时间' })
  issueTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time'
  })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'verify_time',
    nullable: true 
  })
  @ApiProperty({ description: '验证时间' })
  verifyTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
