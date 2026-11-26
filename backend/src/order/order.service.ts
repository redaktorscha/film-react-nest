import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/contracts/films.repository';
import {
  ORDERS_REPOSITORY,
  OrdersRepository,
} from '../repository/contracts/orders.repository';
import { ListDto } from '../films/dto/films.dto';
import { OrderDto, OrderedTicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(order: OrderDto): Promise<ListDto<OrderedTicketDto>> {
    const reservations: { filmId: string; sessionId: string; key: string }[] =
      [];
    const pending = new Set<string>();
    const items: OrderedTicketDto[] = [];
    for (const ticket of order.tickets) {
      const film = await this.filmsRepository.findById(ticket?.film);
      const session = film?.schedule.find(
        (item) => item.id === ticket?.session,
      );
      if (
        !session ||
        !Number.isInteger(ticket.row) ||
        !Number.isInteger(ticket.seat) ||
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException({ error: 'Некорректный билет' });
      }
      const key = `${ticket.row}:${ticket.seat}`;
      const reservationKey = `${film.id}:${session.id}:${key}`;
      if (session.taken.includes(key) || pending.has(reservationKey)) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }
      pending.add(reservationKey);
      reservations.push({ filmId: film.id, sessionId: session.id, key });
      items.push({
        id: randomUUID(),
        film: film.id,
        session: session.id,
        daytime: session.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: session.price,
      });
    }

    const completed: typeof reservations = [];
    try {
      for (const reservation of reservations) {
        const reserved = await this.filmsRepository.reserveSeat(
          reservation.filmId,
          reservation.sessionId,
          reservation.key,
        );
        if (!reserved) {
          throw new BadRequestException({ error: 'Место уже занято' });
        }
        completed.push(reservation);
      }
      await this.ordersRepository.create(order, items);
    } catch (error) {
      for (const reservation of completed.reverse()) {
        const released = await this.filmsRepository.releaseSeat(
          reservation.filmId,
          reservation.sessionId,
          reservation.key,
        );
        if (!released) {
          throw new Error('Не удалось отменить бронирование места');
        }
      }
      throw error;
    }
    return new ListDto(items.length, items);
  }
}
