import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoSchedule, ScheduleSchema } from './schedule.schema';

@Schema({ collection: 'films' })
export class MongoFilm {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: MongoSchedule[];
}

export const FilmSchema = SchemaFactory.createForClass(MongoFilm);
