import { HttpException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from '../repository/films.repository';
import { ListDto, SessionDto } from '../films/dto/films.dto';
import { OrderDto, OrderedTicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  createOrder(order: OrderDto): ListDto<OrderedTicketDto> {
    if (!order || typeof order.email !== 'string' || typeof order.phone !== 'string' ||
        !Array.isArray(order.tickets) || order.tickets.length === 0) {
      throw new HttpException({ error: 'Некорректные данные заказа' }, 400);
    }

    const reservations: { session: SessionDto; key: string }[] = [];
    const pending = new Set<string>();
    const items = order.tickets.map((ticket) => {
      const film = this.filmsRepository.findById(ticket?.film);
      const session = film?.schedule.find((item) => item.id === ticket?.session);
      if (!session || !Number.isInteger(ticket.row) || !Number.isInteger(ticket.seat) ||
          ticket.row < 1 || ticket.row > session.rows || ticket.seat < 1 || ticket.seat > session.seats) {
        throw new HttpException({ error: 'Некорректный билет' }, 400);
      }
      const key = `${ticket.row}:${ticket.seat}`;
      const reservationKey = `${film.id}:${session.id}:${key}`;
      if (session.taken.includes(key) || pending.has(reservationKey)) {
        throw new HttpException({ error: 'Место уже занято' }, 400);
      }
      pending.add(reservationKey);
      reservations.push({ session, key });
      return { id: randomUUID(), film: film.id, session: session.id,
        daytime: session.daytime, row: ticket.row, seat: ticket.seat, price: session.price };
    });

    for (const { session, key } of reservations) {
      session.taken.push(key);
    }
    return new ListDto(items.length, items);
  }
}
