import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ default: true })
  is_active: boolean;
}
