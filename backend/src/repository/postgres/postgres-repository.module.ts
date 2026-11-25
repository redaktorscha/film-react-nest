import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FILMS_REPOSITORY } from '../contracts/films.repository';
import { ORDERS_REPOSITORY } from '../contracts/orders.repository';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';
import { PostgresFilmsRepository } from './postgres-films.repository';
import { PostgresOrdersRepository } from './postgres-orders.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const value = config.get<string>('DATABASE_URL');
        if (!value) throw new Error('DATABASE_URL is not configured');
        const url = new URL(value);
        if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
          throw new Error('DATABASE_URL must use the postgres protocol');
        }
        return {
          type: 'postgres' as const,
          host: url.hostname,
          port: Number(url.port || 5432),
          database: decodeURIComponent(url.pathname.slice(1)),
          username:
            config.get<string>('DATABASE_USERNAME') ||
            decodeURIComponent(url.username),
          password:
            config.get<string>('DATABASE_PASSWORD') ||
            decodeURIComponent(url.password),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    PostgresFilmsRepository,
    PostgresOrdersRepository,
    { provide: FILMS_REPOSITORY, useExisting: PostgresFilmsRepository },
    { provide: ORDERS_REPOSITORY, useExisting: PostgresOrdersRepository },
  ],
  exports: [FILMS_REPOSITORY, ORDERS_REPOSITORY, TypeOrmModule],
})
export class PostgresRepositoryModule {}
