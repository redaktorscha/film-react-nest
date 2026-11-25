import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto, OrderedTicketDto } from '../../order/dto/order.dto';
import { OrdersRepository } from '../contracts/orders.repository';
import { MongoOrder } from './schemas/order.schema';

@Injectable()
export class MongoOrdersRepository implements OrdersRepository {
  constructor(
    @InjectModel(MongoOrder.name) private readonly orders: Model<MongoOrder>,
  ) {}

  async create(order: OrderDto, tickets: OrderedTicketDto[]): Promise<void> {
    await this.orders.create({
      email: order.email,
      phone: order.phone,
      tickets,
    });
  }
}
