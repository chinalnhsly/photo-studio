import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '刷新令牌ID' })
  id: string;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  @ApiProperty({ description: '令牌值' })
  @Index()
  token: string;

  @Column({ default: false })
  @ApiProperty({ description: '是否已使用' })
  isRevoked: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'expires_at'
  })
  @ApiProperty({ description: '过期时间' })
  expiresAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_at',
    nullable: true
  })
  @ApiProperty({ description: '删除时间' })
  deletedAt: Date;
}
