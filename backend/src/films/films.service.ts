import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ListDto, SessionDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  getFilms(): ListDto<FilmDto> {
    const items = this.filmsRepository
      .findAll()
      .map(({ schedule, ...film }) => {
        void schedule;
        return film;
      });
    return new ListDto(items.length, items);
  }

  getSchedule(id: string): ListDto<SessionDto> {
    const film = this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }
    return new ListDto(film.schedule.length, film.schedule);
  }
}
