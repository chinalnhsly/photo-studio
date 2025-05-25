import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('available-dates')
  @ApiOperation({ summary: '获取可用预约日期和时间段' })
  @ApiResponse({ status: 200, description: '返回可用预约日期和时间段列表' })
  async getAvailableDates(@Query('productId') productId: number) {
    return {
      code: 200,
      message: 'success',
      data: await this.appointmentService.getAvailableDates(productId)
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建预约' })
  @ApiResponse({ status: 201, description: '预约创建成功' })
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    const result = await this.appointmentService.createAppointment(createAppointmentDto);
    return {
      code: 201,
      message: '预约创建成功',
      data: result
    };
  }

  @Get('check-availability')
  @ApiOperation({ summary: '检查时间段是否可用' })
  @ApiResponse({ status: 200, description: '返回时间段可用状态' })
  async checkAvailability(@Body() checkAvailabilityDto: any) {
    return this.appointmentService.checkTimeSlotAvailability(
      checkAvailabilityDto.productId,
      checkAvailabilityDto.date,
      parseInt(checkAvailabilityDto.timeSlotId, 10) // 转换为数字
    );
  }
}
