import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Photographer } from '../../photographer/entities/photographer.entity';
import { ReviewImage } from './review-image.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  bookingId: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ nullable: true })
  photographerId: number;

  @ManyToOne(() => Photographer, { nullable: true })
  @JoinColumn({ name: 'photographerId' })
  photographer: Photographer;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isAnonymous: boolean;

  @Column({ default: false })
  isRecommended: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  adminReply: string;

  @Column({ nullable: true })
  adminReplyTime: Date;

  @OneToMany(() => ReviewImage, image => image.review, {
    cascade: true
  })
  images: ReviewImage[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
