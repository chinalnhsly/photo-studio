import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({ length: 255, unique: true })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({ length: 255 })
  @ApiProperty({ description: '密码', writeOnly: true })
  password: string;

  @Column({ length: 255, name: 'contact_info', nullable: true })
  @ApiProperty({ description: '联系信息', required: false })
  contactInfo: string;

  @Column({ length: 50, default: 'user' })
  @ApiProperty({ description: '用户角色', example: 'user, admin, photographer' })
  role: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '头像URL', required: false })
  avatar: string;

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: '手机号码', required: false })
  phone: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '邮箱地址', required: false })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: '用户偏好设置', required: false })
  preferences: Record<string, any>;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: '是否活跃', default: true })
  isActive: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  @ApiProperty({ description: '最后登录时间', required: false })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
