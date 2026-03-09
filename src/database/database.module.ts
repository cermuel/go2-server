import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const sslEnabled =
          configService.get<string>('POSTGRES_SSL')?.toLowerCase() === 'true';
        const rejectUnauthorized =
          configService.get<string>('POSTGRES_SSL_REJECT_UNAUTHORIZED')?.toLowerCase() !==
          'false';

        return {
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
          autoLoadEntities: true,
          synchronize:
            configService.getOrThrow('POSTGRES_SYNC').toLowerCase() === 'true',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
