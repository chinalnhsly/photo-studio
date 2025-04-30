import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_images')
export class ReviewImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewId: number;

  @ManyToOne(() => Review, review => review.images, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'reviewId' })
  review: Review;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 255, nullable: true })
  thumbnail: string;

  @Column({ length: 255, nullable: true })
  originalFilename: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
