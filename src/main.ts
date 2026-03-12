import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://go22.vercel.app",
      "https://go2.cermuel.dev"
    ],
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 4002);
}
bootstrap();
