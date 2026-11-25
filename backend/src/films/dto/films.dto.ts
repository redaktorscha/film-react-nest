import { Expose, Type } from 'class-transformer';

export class FilmDto {
  @Expose()
  id: string;
  @Expose()
  rating: number;
  @Expose()
  director: string;
  @Expose()
  tags: string[];
  @Expose()
  title: string;
  @Expose()
  about: string;
  @Expose()
  description: string;
  @Expose()
  image: string;
  @Expose()
  cover: string;
}

export class SessionDto {
  @Expose()
  id: string;
  @Expose()
  daytime: string;
  @Expose()
  hall: number;
  @Expose()
  rows: number;
  @Expose()
  seats: number;
  @Expose()
  price: number;
  @Expose()
  taken: string[];
}

export class FilmWithScheduleDto extends FilmDto {
  @Expose()
  @Type(() => SessionDto)
  schedule: SessionDto[];
}

export class ListDto<T> {
  constructor(
    public total: number,
    public items: T[],
  ) {}
}
