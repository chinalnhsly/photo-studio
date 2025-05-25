import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @Column()
  rating: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  images: string; // 可存储图片URL的JSON字符串

  @CreateDateColumn()
  created_at: Date;
}
