import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Email extends AbstractEntity<Email> {
  @Column()
  email: string;

  @ManyToMany(() => Url, (url) => url.emails)
  url: Url[];
}
