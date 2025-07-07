import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BookingService } from './services/booking.service';
import { Booking } from './entities/booking.entity';

@ApiTags('预约管理')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiOperation({ summary: '获取所有预约' })
  @ApiResponse({ status: 200, description: '成功获取预约列表', type: [Booking] })
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '成功获取预约', type: Booking })
  async findOne(@Param('id') id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建预约' })
  @ApiBody({ type: Booking, description: '预约数据' })
  @ApiResponse({ status: 201, description: '预约创建成功', type: Booking })
  async create(@Body() bookingData: Partial<Booking>): Promise<Booking> {
    return this.bookingService.create(bookingData);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiBody({ type: Booking, description: '更新的预约数据' })
  @ApiResponse({ status: 200, description: '预约更新成功', type: Booking })
  async update(
    @Param('id') id: number,
    @Body() bookingData: Partial<Booking>,
  ): Promise<Booking> {
    return this.bookingService.update(id, bookingData);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '预约删除成功' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.bookingService.remove(id);
  }
}
