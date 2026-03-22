import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Url } from "./entities/url.entity";
import { Click } from "./entities/click.entity";
import { UrlSubscriber } from "./url.subscriber";
import { Email } from "./entities/email.entity";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    TypeOrmModule.forFeature([Url, Click, Email]),
    BullModule.registerQueue({ name: "go2-email" }),
  ],
  controllers: [UrlController],
  providers: [UrlService, UrlSubscriber],
  exports: [UrlService],
})
export class UrlModule {}
