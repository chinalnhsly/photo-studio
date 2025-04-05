import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';  // 修改导入路径
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(
      createOrderDto.userId,
      createOrderDto.items
    );
  }

  // 其他订单相关接口...
}
