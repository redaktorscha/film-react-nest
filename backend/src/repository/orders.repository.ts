import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { OrderDto, OrderedTicketDto } from '../order/dto/order.dto';
import { orderDtoToEntity } from './converters';
import { ORDER_MODEL } from './constants';
import { OrderEntity } from './schemas/order.schema';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject(ORDER_MODEL) private readonly orders: Model<OrderEntity>,
  ) {}

  async create(order: OrderDto, tickets: OrderedTicketDto[]): Promise<void> {
    await this.orders.create(orderDtoToEntity(order, tickets));
  }
}
