import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { TimeSlot } from './entities/time-slot.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // 检查时间段是否可用
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id: createBookingDto.timeSlotId }
    });
    
    if (!timeSlot) {
      throw new NotFoundException(`Time slot #${createBookingDto.timeSlotId} not found`);
    }
    
    if (!timeSlot.isAvailable) {
      throw new ConflictException(`Time slot #${createBookingDto.timeSlotId} is not available`);
    }
    
    // 检查预约日期是否在时间段的有效期内
    const bookingDate = new Date(createBookingDto.bookingDate);
    if (bookingDate < new Date()) {
      throw new BadRequestException('Booking date cannot be in the past');
    }
    
    // 创建新预约
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      status: 'pending',
    });
    
    // 保存预约并更新时间段状态
    const savedBooking = await this.bookingRepository.save(booking);
    
    await this.timeSlotRepository.update(
      timeSlot.id,
      { isAvailable: false }
    );
    
    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['timeSlot', 'product', 'user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['timeSlot', 'product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['timeSlot', 'product', 'user']
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    
    // 状态更新逻辑
    if (updateBookingDto.status && updateBookingDto.status !== booking.status) {
      // 处理不同状态转换的业务逻辑
      if (updateBookingDto.status === 'confirmed' && booking.status === 'pending') {
        // 从待定到确认的逻辑
      } else if (updateBookingDto.status === 'cancelled') {
        // 取消预约的逻辑，释放时间段
        if (booking.timeSlotId) {
          await this.timeSlotRepository.update(
            booking.timeSlotId,
            { isAvailable: true }
          );
        }
      }
    }
    
    // 更新实体
    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    
    // 如果删除预约，释放时间段
    if (booking.timeSlotId) {
      await this.timeSlotRepository.update(
        booking.timeSlotId,
        { isAvailable: true }
      );
    }
    
    await this.bookingRepository.remove(booking);
  }

  async getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
    const searchDate = new Date(date);
    
    // 验证日期
    if (isNaN(searchDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    
    // 设置日期范围为当天的开始到结束
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // 查询可用时间段
    const timeSlots = await this.timeSlotRepository.find({
      where: {
        startTime: Between(startOfDay, endOfDay),
        isAvailable: true
      },
      order: { startTime: 'ASC' }
    });
    
    return timeSlots;
  }
}
