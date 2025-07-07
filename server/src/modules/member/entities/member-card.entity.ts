import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('member_cards')
export class MemberCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  cardNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ 
    type: 'timestamptz',
    name: 'issue_date'
  })
  @ApiProperty({ description: '发卡日期' })
  issueDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'activation_date',
    nullable: true 
  })
  @ApiProperty({ description: '激活日期' })
  activationDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expiry_date'
  })
  @ApiProperty({ description: '过期日期' })
  expiryDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_used_date',
    nullable: true 
  })
  @ApiProperty({ description: '最后使用日期' })
  lastUsedDate: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @ManyToOne(() => Member, member => member.cards)
  @JoinColumn({ name: 'memberId' })
  member: Member;

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
