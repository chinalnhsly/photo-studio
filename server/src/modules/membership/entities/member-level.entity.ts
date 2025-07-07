import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserMembership } from './user-membership.entity';

@Entity('member_levels')
export class MemberLevel {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '等级ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '等级名称' })
  name: string;

  @Column()
  @ApiProperty({ description: '等级图标' })
  icon: string;

  @Column({ type: 'int' })
  @ApiProperty({ description: '所需积分' })
  requiredPoints: number;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  @ApiProperty({ description: '折扣率，例如0.95表示95折' })
  discountRate: number;

  @Column({ default: false })
  @ApiProperty({ description: '是否享受免邮特权' })
  freeShipping: boolean;

  @Column({ default: false })
  @ApiProperty({ description: '是否有生日特权' })
  birthdayPrivilege: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '等级描述', required: false })
  description: string;

  @OneToMany(() => UserMembership, userMembership => userMembership.memberLevel)
  userMemberships: UserMembership[];

  @Column({ 
    type: 'timestamptz',
    name: 'valid_from',
    nullable: true 
  })
  @ApiProperty({ description: '等级生效时间' })
  validFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until',
    nullable: true 
  })
  @ApiProperty({ description: '等级失效时间' })
  validUntil: Date;

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
