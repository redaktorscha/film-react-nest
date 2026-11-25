import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmDto, FilmWithScheduleDto } from '../../films/dto/films.dto';
import { FilmsRepository } from '../contracts/films.repository';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find();
    return films.map(
      ({
        id,
        rating,
        director,
        tags,
        title,
        about,
        description,
        image,
        cover,
      }) => ({
        id,
        rating,
        director,
        tags,
        title,
        about,
        description,
        image,
        cover,
      }),
    );
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      return null;
    }
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });
    if (!film) return null;
    const { rating, director, tags, title, about, description, image, cover } =
      film;
    return {
      id,
      rating,
      director,
      tags,
      title,
      about,
      description,
      image,
      cover,
      schedule: film.schedule.map(
        ({ id, daytime, hall, rows, seats, price, taken }) => ({
          id,
          daytime,
          hall,
          rows,
          seats,
          price,
          taken,
        }),
      ),
    };
  }

  async reserveSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    const result = await this.schedules
      .createQueryBuilder()
      .update(Schedule)
      .set({ taken: () => 'array_append(taken, :key)' })
      .where(
        'id = :sessionId AND film_id = :filmId AND NOT (:key = ANY(taken))',
        { sessionId, filmId, key },
      )
      .execute();
    return result.affected === 1;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    const result = await this.schedules
      .createQueryBuilder()
      .update(Schedule)
      .set({ taken: () => 'array_remove(taken, :key)' })
      .where('id = :sessionId AND film_id = :filmId AND :key = ANY(taken)', {
        sessionId,
        filmId,
        key,
      })
      .execute();
    return result.affected === 1;
  }
}
