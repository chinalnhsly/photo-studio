import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';

@Entity('member_levels')
export class MemberLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  requiredPoints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => Member, member => member.level)
  members: Member[];

  @Column({ 
    type: 'timestamptz',
    name: 'effective_date',
    nullable: true 
  })
  @ApiProperty({ description: '等级生效时间' })
  effectiveDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expiry_date',
    nullable: true 
  })
  @ApiProperty({ description: '等级过期时间' })
  expiryDate: Date;

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
