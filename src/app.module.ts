import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UrlModule } from "./url/url.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Url } from "./url/entities/url.entity";
import { Click } from "./url/entities/click.entity";
import { Email } from "./url/entities/email.entity";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UrlModule,
    TypeOrmModule.forFeature([Url, Click, Email]),
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
      defaultJobOptions: { attempts: 3, removeOnComplete: 3, removeOnFail: 10 },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
