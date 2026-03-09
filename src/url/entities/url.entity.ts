import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Click } from './click.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Email } from './email.entity';

@Entity()
export class Url extends AbstractEntity<Url> {
  @Column()
  destination: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  customCode: string;

  @OneToMany(() => Click, (click) => click.url, { cascade: true })
  clicks: Click[];

  @ManyToMany(() => Email, (email) => email.url)
  @JoinTable()
  emails: Email[];
}
