import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { Url } from './url.entity';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity()
export class Click extends AbstractEntity<Click> {
  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  os: string;

  @Column({ nullable: true })
  device: string;

  @CreateDateColumn({})
  createdAt: Date;

  @ManyToOne(() => Url, (url) => url.clicks)
  url: Url;
}
