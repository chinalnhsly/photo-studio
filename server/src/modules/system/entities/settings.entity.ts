import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_from',
    nullable: true 
  })
  @ApiProperty({ description: '生效时间' })
  effectiveFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_to',
    nullable: true 
  })
  @ApiProperty({ description: '失效时间' })
  effectiveTo: Date;

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
