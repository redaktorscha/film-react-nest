import { Injectable } from '@nestjs/common';
import { FilmWithScheduleDto } from '../films/dto/films.dto';
import initialFilms from '../../test/mongodb_initial_stub.json';

@Injectable()
export class FilmsRepository {
  private readonly films: FilmWithScheduleDto[] = structuredClone(initialFilms);

  findAll(): FilmWithScheduleDto[] {
    return this.films;
  }

  findById(id: string): FilmWithScheduleDto | undefined {
    return this.films.find((film) => film.id === id);
  }
}
