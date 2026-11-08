import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { filmToDto, filmWithScheduleToDto } from './converters';
import { FILM_MODEL } from './constants';
import { FilmEntity } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@Inject(FILM_MODEL) private readonly films: Model<FilmEntity>) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find().lean().exec();
    return films.map((film) => filmToDto(film));
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.films.findOne({ id }).lean().exec();
    return film ? filmWithScheduleToDto(film) : null;
  }

  async reserveSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    const result = await this.films
      .updateOne(
        {
          id: filmId,
          schedule: { $elemMatch: { id: sessionId, taken: { $ne: key } } },
        },
        { $addToSet: { 'schedule.$.taken': key } },
      )
      .exec();
    return result.modifiedCount === 1;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    key: string,
  ): Promise<boolean> {
    const result = await this.films
      .updateOne(
        { id: filmId, schedule: { $elemMatch: { id: sessionId, taken: key } } },
        { $pull: { 'schedule.$.taken': key } },
      )
      .exec();
    return result.modifiedCount === 1;
  }
}
