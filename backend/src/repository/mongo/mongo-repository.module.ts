import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection, Model } from 'mongoose';
import { FilmEntity, FilmSchema } from './schemas/film.schema';
import { OrderEntity, OrderSchema } from './schemas/order.schema';
import { MongoFilmsRepository } from './mongo-films.repository';
import { MongoOrdersRepository } from './mongo-orders.repository';
import { FILM_MODEL, MONGO_CONNECTION, ORDER_MODEL } from './constants';
import { FILMS_REPOSITORY } from '../contracts/films.repository';
import { ORDERS_REPOSITORY } from '../contracts/orders.repository';

export { FILM_MODEL, MONGO_CONNECTION, ORDER_MODEL } from './constants';

@Module({
  providers: [
    {
      provide: MONGO_CONNECTION,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<Connection> => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) throw new Error('DATABASE_URL is not configured');
        return createConnection(url).asPromise();
      },
    },
    {
      provide: FILM_MODEL,
      inject: [MONGO_CONNECTION],
      useFactory: (connection: Connection): Model<FilmEntity> =>
        connection.model<FilmEntity>('Film', FilmSchema),
    },
    {
      provide: ORDER_MODEL,
      inject: [MONGO_CONNECTION],
      useFactory: (connection: Connection): Model<OrderEntity> =>
        connection.model<OrderEntity>('Order', OrderSchema),
    },
    MongoFilmsRepository,
    MongoOrdersRepository,
    { provide: FILMS_REPOSITORY, useExisting: MongoFilmsRepository },
    { provide: ORDERS_REPOSITORY, useExisting: MongoOrdersRepository },
  ],
  exports: [FILMS_REPOSITORY, ORDERS_REPOSITORY],
})
export class MongoRepositoryModule implements OnApplicationShutdown {
  constructor(
    @Inject(MONGO_CONNECTION) private readonly connection: Connection,
  ) {}

  async onApplicationShutdown() {
    await this.connection.close();
  }
}
