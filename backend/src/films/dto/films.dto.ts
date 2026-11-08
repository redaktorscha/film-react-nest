export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class SessionDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmWithScheduleDto extends FilmDto {
  schedule: SessionDto[];
}

export class ListDto<T> {
  constructor(
    public total: number,
    public items: T[],
  ) {}
}
