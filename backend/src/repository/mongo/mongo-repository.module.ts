import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoFilm, FilmSchema } from './schemas/film.schema';
import { MongoOrder, OrderSchema } from './schemas/order.schema';
import { MongoFilmsRepository } from './mongo-films.repository';
import { MongoOrdersRepository } from './mongo-orders.repository';
import { FILMS_REPOSITORY } from '../contracts/films.repository';
import { ORDERS_REPOSITORY } from '../contracts/orders.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('DATABASE_URL');
        if (!uri) throw new Error('DATABASE_URL is not configured');
        return { uri };
      },
    }),
    MongooseModule.forFeature([
      { name: MongoFilm.name, schema: FilmSchema },
      { name: MongoOrder.name, schema: OrderSchema },
    ]),
  ],
  providers: [
    MongoFilmsRepository,
    MongoOrdersRepository,
    { provide: FILMS_REPOSITORY, useExisting: MongoFilmsRepository },
    { provide: ORDERS_REPOSITORY, useExisting: MongoOrdersRepository },
  ],
  exports: [FILMS_REPOSITORY, ORDERS_REPOSITORY],
})
export class MongoRepositoryModule {}
