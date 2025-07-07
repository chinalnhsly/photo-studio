import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // 资源标识，如 'user:create'

  @Column()
  name: string; // 资源名称

  @Column({ nullable: true })
  description: string;
}
