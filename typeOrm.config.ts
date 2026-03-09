import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/url/entities/url.entity';
import { Click } from 'src/url/entities/click.entity';

config();

const configService = new ConfigService();
const databaseUrl = configService.get<string>('DATABASE_URL');
const sslEnabled =
  configService.get<string>('POSTGRES_SSL')?.toLowerCase() === 'true';
const rejectUnauthorized =
  configService.get<string>('POSTGRES_SSL_REJECT_UNAUTHORIZED')?.toLowerCase() !==
  'false';

export default new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? { url: databaseUrl }
    : {
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: Number(configService.getOrThrow<string>('POSTGRES_PORT')),
        database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
        username: configService.getOrThrow<string>('POSTGRES_USERNAME'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
      }),
  ssl: sslEnabled ? { rejectUnauthorized } : false,
  migrations: ['migrations/**'],
  entities: [Url, Click],
});
