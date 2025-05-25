import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('review_comments')
export class ReviewComment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '评论ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'comment_time'
  })
  @ApiProperty({ description: '评论时间' })
  commentTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'reply_time',
    nullable: true 
  })
  @ApiProperty({ description: '回复时间' })
  replyTime: Date;

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
