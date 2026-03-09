import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Url } from './entities/url.entity';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class UrlSubscriber implements EntitySubscriberInterface<Url> {
  private readonly logger = new Logger(UrlSubscriber.name);

  constructor(datasource: DataSource) {
    datasource.subscribers.push(this);
  }

  listenTo(): string | Function {
    return Url;
  }

  beforeInsert(event: InsertEvent<Url>) {
    console.log(`BEFORE URL INSERTED: `, event.entity);
  }
  afterInsert(event: InsertEvent<Url>) {
    console.log(`AFTER URL INSERTED: `, event.entity);
  }
}
