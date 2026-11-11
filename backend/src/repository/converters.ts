import {
  FilmDto,
  FilmWithScheduleDto,
  SessionDto,
} from '../films/dto/films.dto';
import { OrderDto, OrderedTicketDto } from '../order/dto/order.dto';
import { FilmEntity } from './schemas/film.schema';
import { OrderEntity } from './schemas/order.schema';
import { ScheduleEntity } from './schemas/schedule.schema';

export function scheduleToDto(schedule: ScheduleEntity): SessionDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...schedule.taken],
  };
}

export function filmToDto(film: FilmEntity): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: [...film.tags],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function filmWithScheduleToDto(film: FilmEntity): FilmWithScheduleDto {
  return { ...filmToDto(film), schedule: film.schedule.map(scheduleToDto) };
}

export function filmDtoToEntity(film: FilmWithScheduleDto): FilmEntity {
  return {
    ...filmToDto(film),
    schedule: film.schedule.map((session) => ({
      ...scheduleToDto(session),
    })),
  };
}

export function orderDtoToEntity(
  order: OrderDto,
  tickets: OrderedTicketDto[],
): OrderEntity {
  return {
    email: order.email,
    phone: order.phone,
    tickets: tickets.map((ticket) => ({ ...ticket })),
  };
}
