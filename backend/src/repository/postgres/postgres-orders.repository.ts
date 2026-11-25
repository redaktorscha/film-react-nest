import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderDto, OrderedTicketDto } from '../../order/dto/order.dto';
import { OrdersRepository } from '../contracts/orders.repository';

@Injectable()
export class PostgresOrdersRepository implements OrdersRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(order: OrderDto, tickets: OrderedTicketDto[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const [created] = await manager.query(
        'INSERT INTO orders (email, phone) VALUES ($1, $2) RETURNING id',
        [order.email, order.phone],
      );
      for (const ticket of tickets) {
        await manager.query(
          `INSERT INTO order_tickets
            (id, order_id, film_id, session_id, daytime, row, seat, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            ticket.id,
            created.id,
            ticket.film,
            ticket.session,
            ticket.daytime,
            ticket.row,
            ticket.seat,
            ticket.price,
          ],
        );
      }
    });
  }
}
