import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AddBookingNoteDto } from './dto/add-booking-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BookingStatus } from './enums/booking-status.enum';

@ApiTags('预约管理')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建预约' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有预约' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: BookingStatus,
    @Query('shootingType') shootingType?: string,
    @Query('photographerId') photographerId?: number,
    @Query('studioId') studioId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: number,
  ) {
    return this.bookingService.findAll({
      page,
      limit,
      status,
      shootingType,
      photographerId,
      studioId,
      startDate,
      endDate,
      search,
      userId,
    });
  }

  @Get('number/:bookingNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过预约号获取预约' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByNumber(@Param('bookingNumber') bookingNumber: string) {
    return this.bookingService.findByNumber(bookingNumber);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取今日预约' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getTodayBookings() {
    return this.bookingService.getTodayBookings();
  }

  @Get('daily/:date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取某一天的预约日程' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getDailySchedule(@Param('date') date: string) {
    return this.bookingService.getDailySchedule(date);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取预约统计数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getBookingsStats() {
    return this.bookingService.getBookingsStats();
  }

  @Get('photographer/:photographerId/schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取摄影师日程' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getPhotographerSchedule(
    @Param('photographerId') photographerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingService.getPhotographerSchedule(+photographerId, startDate, endDate);
  }

  @Get('studio/:studioId/schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取工作室日程' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getStudioSchedule(
    @Param('studioId') studioId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingService.getStudioSchedule(+studioId, startDate, endDate);
  }

  @Get('available-slots')
  @ApiOperation({ summary: '获取可用时间段' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAvailableTimeSlots(
    @Query('date') date: string,
    @Query('photographerId') photographerId?: number,
    @Query('studioId') studioId?: number,
  ) {
    return this.bookingService.getAvailableTimeSlots(
      date,
      photographerId,
      studioId,
    );
  }

  @Get('user/upcoming')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户即将到来的预约' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUpcomingBookings(@Req() req, @Query('limit') limit?: number) {
    return this.bookingService.getUpcomingBookings(req.user.id, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取预约详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新预约' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除预约' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }

  @Post(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '添加预约备注' })
  @ApiResponse({ status: 201, description: '添加成功' })
  async addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddBookingNoteDto,
    @Req() req,
  ) {
    return this.bookingService.addNote(+id, req.user.id, addNoteDto);
  }

  @Get(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取预约备注' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getNotes(@Param('id') id: string) {
    return this.bookingService.getNotes(+id);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新预约状态' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async changeStatus(
    @Param('id') id: string,
    @Param('status') status: BookingStatus,
  ) {
    return this.bookingService.changeStatus(+id, status);
  }
}
