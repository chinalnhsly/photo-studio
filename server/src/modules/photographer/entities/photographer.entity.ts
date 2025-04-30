import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { ShootingType } from '../../booking/enums/shooting-type.enum';

@Entity('photographers')
export class Photographer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'simple-array', nullable: true })
  portfolioImages: string[];

  @Column({ type: 'simple-json', nullable: true })
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'simple-json', nullable: true })
  workingHours: {
    monday: { start: string; end: string; isWorking: boolean };
    tuesday: { start: string; end: string; isWorking: boolean };
    wednesday: { start: string; end: string; isWorking: boolean };
    thursday: { start: string; end: string; isWorking: boolean };
    friday: { start: string; end: string; isWorking: boolean };
    saturday: { start: string; end: string; isWorking: boolean };
    sunday: { start: string; end: string; isWorking: boolean };
  };

  @ManyToMany(() => ShootingType)
  @JoinTable({
    name: 'photographer_specialties',
    joinColumn: { name: 'photographerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'shootingType', referencedColumnName: 'id' }
  })
  shootingTypes: ShootingType[];

  @OneToMany(() => Booking, booking => booking.photographer)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
