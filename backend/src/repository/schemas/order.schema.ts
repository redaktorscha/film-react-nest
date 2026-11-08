import { Schema } from 'mongoose';

export interface OrderedTicketEntity {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export interface OrderEntity {
  email: string;
  phone: string;
  tickets: OrderedTicketEntity[];
}

const TicketSchema = new Schema<OrderedTicketEntity>(
  {
    id: { type: String, required: true },
    film: { type: String, required: true },
    session: { type: String, required: true },
    daytime: { type: String, required: true },
    row: { type: Number, required: true },
    seat: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

export const OrderSchema = new Schema<OrderEntity>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    tickets: { type: [TicketSchema], required: true },
  },
  { collection: 'orders' },
);
