import { Controller, Get, Post, Body, Param, Query, UseGuards, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../auth/decorators/user.decorator';
import { OrderStatus } from './enums/order-status.enum';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '创建新订单' })
  @ApiResponse({ status: 201, description: '订单创建成功' })
  async createOrder(@Body() createOrderDto: CreateOrderDto, @User() user) {
    const order = await this.orderService.createOrder(createOrderDto, user.id);
    return {
      code: 201,
      message: '订单创建成功',
      data: order
    };
  }

  @Get()
  @ApiOperation({ summary: '获取用户订单列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false })
  @ApiQuery({ name: 'status', description: '订单状态', required: false, enum: ['pending', 'paid', 'scheduled', 'completed', 'cancelled'] })
  @ApiResponse({ status: 200, description: '成功返回订单列表' })
  async getUserOrders(
    @User() user,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: OrderStatus
  ) {
    const { orders, total } = await this.orderService.getUserOrders(user.id, page, limit, status);
    return {
      code: 200,
      message: '获取成功',
      data: orders,
      pagination: {
        total,
        page,
        limit
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiParam({ name: 'id', description: '订单ID' })
  @ApiResponse({ status: 200, description: '成功返回订单详情' })
  async getOrderDetail(@Param('id') id: number, @User() user) {
    const order = await this.orderService.getOrderById(id);
    
    // 检查权限 - 只能查看自己的订单
    if (order.userId !== user.id && !user.roles.includes('admin')) {
      return {
        code: 403,
        message: '无权查看该订单'
      };
    }
    
    return {
      code: 200,
      message: '获取成功',
      data: order
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  @ApiParam({ name: 'id', description: '订单ID' })
  @ApiResponse({ status: 200, description: '订单取消成功' })
  async cancelOrder(
    @Param('id') id: number,
    @Body() cancelOrderDto: CancelOrderDto,
    @User() user
  ) {
    const order = await this.orderService.cancelOrder(id, user.id, cancelOrderDto.reason);
    return {
      code: 200,
      message: '订单已取消',
      data: order
    };
  }

  @Put(':id/appointment')
  @ApiOperation({ summary: '更新预约信息' })
  @ApiParam({ name: 'id', description: '订单ID' })
  @ApiResponse({ status: 200, description: '预约信息更新成功' })
  async updateAppointment(
    @Param('id') id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @User() user
  ) {
    // 获取订单检查权限
    const order = await this.orderService.getOrderById(id);
    if (order.userId !== user.id && !user.roles.includes('admin')) {
      return {
        code: 403,
        message: '无权操作该订单'
      };
    }
    
    const updatedOrder = await this.orderService.updateAppointmentInfo(id, {
      appointmentDate: new Date(updateAppointmentDto.appointmentDate),
      timeSlotId: updateAppointmentDto.timeSlotId,
      customerName: updateAppointmentDto.customerName,
      customerPhone: updateAppointmentDto.customerPhone,
      remark: updateAppointmentDto.remark
    });
    
    return {
      code: 200,
      message: '预约信息更新成功',
      data: updatedOrder
    };
  }

  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '完成订单(仅管理员)' })
  @ApiParam({ name: 'id', description: '订单ID' })
  @ApiResponse({ status: 200, description: '订单已标记为完成' })
  async completeOrder(@Param('id') id: number) {
    const order = await this.orderService.completeOrder(id);
    return {
      code: 200,
      message: '订单已完成',
      data: order
    };
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: '根据订单号获取订单' })
  @ApiParam({ name: 'orderNumber', description: '订单号' })
  @ApiResponse({ status: 200, description: '成功返回订单详情' })
  async getOrderByNumber(@Param('orderNumber') orderNumber: string, @User() user) {
    const order = await this.orderService.getOrderByNumber(orderNumber);
    
    // 检查权限 - 只能查看自己的订单
    if (order.userId !== user.id && !user.roles.includes('admin')) {
      return {
        code: 403,
        message: '无权查看该订单'
      };
    }
    
    return {
      code: 200,
      message: '获取成功',
      data: order
    };
  }
}
