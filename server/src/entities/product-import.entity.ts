import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('product_imports')
export class ProductImport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  admin_id: number;

  @Column()
  file_name: string;

  @Column()
  status: string; // success, failed, pending

  @Column('text', { nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;
}
