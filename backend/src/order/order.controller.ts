import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ListDto } from '../films/dto/films.dto';
import { OrderDto, OrderedTicketDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  createOrder(@Body() order: OrderDto): ListDto<OrderedTicketDto> {
    return this.orderService.createOrder(order);
  }
}
