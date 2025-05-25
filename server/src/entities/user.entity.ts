import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  contact_info: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
