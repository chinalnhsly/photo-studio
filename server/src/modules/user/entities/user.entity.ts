import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true }) // 响应中排除密码
  password: string;

  @Column({ nullable: true, name: 'contact_info' })
  @ApiProperty({ description: '联系方式' })
  contactInfo: string;

  @Column({ default: 'user' })
  @ApiProperty({ description: '用户角色', enum: ['user', 'admin', 'staff'] })
  role: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '头像URL' })
  avatar: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '手机号码' })
  phone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '电子邮箱' })
  email: string;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty({ description: '用户偏好设置' })
  preferences: Record<string, any>;

  @Column({ name: 'is_active', default: true }) // 修改这里，使用name属性指定正确的列名
  @ApiProperty({ description: '账户是否激活' })
  isActive: boolean;

  @Column({ name: 'last_login', nullable: true, type: 'timestamptz' }) // 添加name属性
  @ApiProperty({ description: '上次登录时间' })
  lastLogin: Date;

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

  // 密码哈希处理
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // 只有当密码被修改时才重新哈希
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
