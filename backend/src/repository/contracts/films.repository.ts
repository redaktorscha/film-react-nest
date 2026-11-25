import { FilmDto, FilmWithScheduleDto } from '../../films/dto/films.dto';

export const FILMS_REPOSITORY = Symbol('FILMS_REPOSITORY');

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmWithScheduleDto | null>;
  reserveSeat(filmId: string, sessionId: string, key: string): Promise<boolean>;
  releaseSeat(filmId: string, sessionId: string, key: string): Promise<boolean>;
}
