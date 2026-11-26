import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ListDto, SessionDto } from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/contracts/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async getFilms(): Promise<ListDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return new ListDto(items.length, items);
  }

  async getSchedule(id: string): Promise<ListDto<SessionDto>> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }
    return new ListDto(film.schedule.length, film.schedule);
  }
}
