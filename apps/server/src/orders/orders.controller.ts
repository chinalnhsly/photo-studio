import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, OrderFilterDto } from './dto/order.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')  // 确保这里有正确的路由前缀
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: UserEntity) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取用户订单列表' })
  async findAll(@User() user: UserEntity, @Query() query: OrderFilterDto) {
    return this.ordersService.findAll({
      ...query,
      userId: user.id,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新订单状态' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
