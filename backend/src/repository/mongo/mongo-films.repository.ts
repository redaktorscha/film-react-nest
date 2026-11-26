import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { FilmDto, FilmWithScheduleDto } from '../../films/dto/films.dto';
import { FilmsRepository } from '../contracts/films.repository';
import { MongoFilm } from './schemas/film.schema';

@Injectable()
export class MongoFilmsRepository implements FilmsRepository {
  constructor(
    @InjectModel(MongoFilm.name) private readonly films: Model<MongoFilm>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find().lean().exec();
    return plainToInstance(FilmDto, films, { excludeExtraneousValues: true });
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.films.findOne({ id }).lean().exec();
    return film
      ? plainToInstance(FilmWithScheduleDto, film, {
          excludeExtraneousValues: true,
        })
      : null;
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
