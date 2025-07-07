import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { BookingFile } from '../entities/booking-file.entity';
import { BookingSlot } from '../entities/booking-slot.entity';
import { TimeSlot } from '../entities/time-slot.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingFile)
    private bookingFileRepository: Repository<BookingFile>,
    @InjectRepository(BookingSlot)
    private bookingSlotRepository: Repository<BookingSlot>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async findAll(): Promise<Booking[]> {
    try {
      this.logger.log('获取所有预约');
      return await this.bookingRepository.find({
        relations: ['files'],
        take: 100
      });
    } catch (error) {
      this.logger.error(`获取预约列表失败: ${error.message}`, error.stack);
      throw new InternalServerErrorException('获取预约列表时发生错误');
    }
  }

  async findOne(id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['files'],
      });
      
      if (!booking) {
        throw new NotFoundException(`未找到ID为${id}的预约`);
      }
      
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`获取预约详情失败: ${error.message}`, error.stack);
      throw new InternalServerErrorException('获取预约详情时发生错误');
    }
  }

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    try {
      const booking = this.bookingRepository.create(bookingData);
      return await this.bookingRepository.save(booking);
    } catch (error) {
      this.logger.error(`创建预约失败: ${error.message}`, error.stack);
      throw new InternalServerErrorException('创建预约时发生错误');
    }
  }

  async update(id: number, bookingData: Partial<Booking>): Promise<Booking> {
    try {
      await this.bookingRepository.update(id, bookingData);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`更新预约失败: ${error.message}`, error.stack);
      throw new InternalServerErrorException('更新预约时发生错误');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.bookingRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`未找到ID为${id}的预约`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`删除预约失败: ${error.message}`, error.stack);
      throw new InternalServerErrorException('删除预约时发生错误');
    }
  }
}
