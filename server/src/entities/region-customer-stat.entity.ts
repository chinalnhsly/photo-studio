import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('region_customer_stats')
export class RegionCustomerStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  region: string;

  @Column()
  customer_count: number;
}
