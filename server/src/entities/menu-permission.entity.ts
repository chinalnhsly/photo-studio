import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menu_permissions')
export class MenuPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  menu_id: number;

  @Column()
  permission_id: number;
}
