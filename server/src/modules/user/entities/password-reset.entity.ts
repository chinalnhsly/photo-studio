import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '主键' })
  id: string;

  @Column({ 
    type: 'timestamptz',
    name: 'request_time'
  })
  @ApiProperty({ description: '请求时间' })
  requestTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time'
  })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'reset_time',
    nullable: true 
  })
  @ApiProperty({ description: '重置时间' })
  resetTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
