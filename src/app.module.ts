import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UrlModule } from './url/url.module';
import { UrlSubscriber } from './url/url.subscriber';
import { UrlService } from './url/url.service';
import { UrlController } from './url/url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url/entities/url.entity';
import { Click } from './url/entities/click.entity';
import { Email } from './url/entities/email.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UrlModule,
    TypeOrmModule.forFeature([Url, Click, Email]),
  ],
  controllers: [AppController, UrlController],
  providers: [AppService, UrlService, UrlSubscriber],
})
export class AppModule {}
