import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column()
  image: string;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column({ default: true })
  is_active: boolean;
}
