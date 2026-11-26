import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class MongoOrderedTicket {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  session: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  seat: number;

  @Prop({ required: true })
  price: number;
}

const OrderedTicketSchema = SchemaFactory.createForClass(MongoOrderedTicket);

@Schema({ collection: 'orders' })
export class MongoOrder {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [OrderedTicketSchema], required: true })
  tickets: MongoOrderedTicket[];
}

export const OrderSchema = SchemaFactory.createForClass(MongoOrder);
