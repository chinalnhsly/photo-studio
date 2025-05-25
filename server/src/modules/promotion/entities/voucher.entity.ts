import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '唯一标识' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_from'
  })
  @ApiProperty({ description: '生效时间' })
  validFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until'
  })
  @ApiProperty({ description: '失效时间' })
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

  @UpdateDateColumn({ 
    type: 'timestamptz',
    name: 'updated_at'
  })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
