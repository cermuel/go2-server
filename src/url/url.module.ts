import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Click } from './entities/click.entity';
import { UrlSubscriber } from './url.subscriber';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click, Email])],
  controllers: [UrlController],
  providers: [UrlService, UrlSubscriber],
})
export class UrlModule {}
