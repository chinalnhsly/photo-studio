import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('login_histories')
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'login_time'
  })
  @ApiProperty({ description: '登录时间' })
  loginTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'logout_time',
    nullable: true 
  })
  @ApiProperty({ description: '登出时间' })
  logoutTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
