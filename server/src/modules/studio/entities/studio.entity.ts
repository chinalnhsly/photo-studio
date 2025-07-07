import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ...其他字段...
}
