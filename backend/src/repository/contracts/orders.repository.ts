import { OrderDto, OrderedTicketDto } from '../../order/dto/order.dto';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface OrdersRepository {
  create(order: OrderDto, tickets: OrderedTicketDto[]): Promise<void>;
}
