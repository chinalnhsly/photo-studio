import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Studio } from './entities/studio.entity';
import { BookingNote } from './entities/booking-note.entity';
import { Photographer } from '../photographer/entities/photographer.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AddBookingNoteDto } from './dto/add-booking-note.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import * as moment from 'moment';
import { nanoid } from 'nanoid';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Studio)
    private studioRepository: Repository<Studio>,
    @InjectRepository(BookingNote)
    private bookingNoteRepository: Repository<BookingNote>,
    @InjectRepository(Photographer)
    private photographerRepository: Repository<Photographer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(options: any = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      shootingType,
      photographerId,
      studioId,
      startDate,
      endDate,
      search,
      userId,
    } = options;
    
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.photographer', 'photographer')
      .leftJoinAndSelect('booking.studio', 'studio')
      .leftJoinAndSelect('booking.products', 'products');
      
    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }
    
    if (shootingType) {
      queryBuilder.andWhere('booking.shootingType = :shootingType', { shootingType });
    }
    
    if (photographerId) {
      queryBuilder.andWhere('booking.photographerId = :photographerId', { photographerId });
    }
    
    if (studioId) {
      queryBuilder.andWhere('booking.studioId = :studioId', { studioId });
    }
    
    if (userId) {
      queryBuilder.andWhere('booking.userId = :userId', { userId });
    }
    
    if (startDate) {
      queryBuilder.andWhere('booking.date >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('booking.date <= :endDate', { endDate });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(booking.customerName LIKE :search OR booking.customerPhone LIKE :search OR booking.customerEmail LIKE :search OR booking.bookingNumber LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    queryBuilder.orderBy('booking.date', 'DESC');
    
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();
    
    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'photographer', 'studio', 'products', 'notes', 'notes.user'],
    });
    
    if (!booking) {
      throw new NotFoundException(`预约ID ${id} 不存在`);
    }
    
    return booking;
  }

  async findByNumber(bookingNumber: string) {
    const booking = await this.bookingRepository.findOne({
      where: { bookingNumber },
      relations: ['user', 'photographer', 'studio', 'products'],
    });
    
    if (!booking) {
      throw new NotFoundException(`预约号 ${bookingNumber} 不存在`);
    }
    
    return booking;
  }

  async create(createBookingDto: CreateBookingDto) {
    const { date, startTime, endTime, photographerId, studioId, userId, productIds } = createBookingDto;
    
    // 检查用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ID ${userId} not found`);
    }
    
    // 检查摄影师是否可用
    if (photographerId) {
      await this.checkPhotographerAvailability(photographerId, date, startTime, endTime);
    }
    
    // 检查工作室是否可用
    if (studioId) {
      await this.checkStudioAvailability(studioId, date, startTime, endTime);
    }
    
    // 获取关联产品
    let products = [];
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.find({
        where: { id: In(productIds) }
      });
      
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more product IDs are invalid');
      }
    }
    
    // 创建预约号
    const bookingNumber = await this.generateBookingNumber();
    
    // 创建预约
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      bookingNumber,
      products,
    });
    
    return this.bookingRepository.save(booking);
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    
    const { date, startTime, endTime, photographerId, studioId, productIds } = updateBookingDto;
    
    // 如果更改了预约时间或者摄影师，检查是否有冲突
    if (
      (date && date !== booking.date.toISOString().split('T')[0]) ||
      (startTime && startTime !== booking.startTime) ||
      (endTime && endTime !== booking.endTime) ||
      (photographerId && photographerId !== booking.photographerId)
    ) {
      const checkDate = date || booking.date.toISOString().split('T')[0];
      const checkStartTime = startTime || booking.startTime;
      const checkEndTime = endTime || booking.endTime;
      const checkPhotographerId = photographerId || booking.photographerId;
      
      if (checkPhotographerId) {
        await this.checkPhotographerAvailability(
          checkPhotographerId, 
          checkDate, 
          checkStartTime, 
          checkEndTime,
          id
        );
      }
    }
    
    // 如果更改了预约时间或者工作室，检查是否有冲突
    if (
      (date && date !== booking.date.toISOString().split('T')[0]) ||
      (startTime && startTime !== booking.startTime) ||
      (endTime && endTime !== booking.endTime) ||
      (studioId && studioId !== booking.studioId)
    ) {
      const checkDate = date || booking.date.toISOString().split('T')[0];
      const checkStartTime = startTime || booking.startTime;
      const checkEndTime = endTime || booking.endTime;
      const checkStudioId = studioId || booking.studioId;
      
      if (checkStudioId) {
        await this.checkStudioAvailability(
          checkStudioId, 
          checkDate, 
          checkStartTime, 
          checkEndTime,
          id
        );
      }
    }
    
    // 获取关联产品
    if (productIds !== undefined) {
      if (productIds.length > 0) {
        const products = await this.productRepository.find({
          where: { id: In(productIds) }
        });
        
        if (products.length !== productIds.length) {
          throw new BadRequestException('One or more product IDs are invalid');
        }
        
        booking.products = products;
      } else {
        booking.products = [];
      }
    }
    
    // 更新状态相关字段
    if (updateBookingDto.isCancelled && !booking.isCancelled) {
      updateBookingDto.status = BookingStatus.CANCELLED;
      updateBookingDto.cancelledAt = new Date();
    }
    
    if (updateBookingDto.isNoShow && !booking.isNoShow) {
      updateBookingDto.status = BookingStatus.NO_SHOW;
    }
    
    // 如果确认预约
    if (updateBookingDto.isConfirmed && !booking.isConfirmed) {
      updateBookingDto.status = BookingStatus.CONFIRMED;
    }
    
    // 更新预约
    Object.assign(booking, updateBookingDto);
    
    return this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    
    // 检查是否可以删除预约
    if (booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(`Cannot delete booking with status ${booking.status}`);
    }
    
    return this.bookingRepository.remove(booking);
  }

  async addNote(id: number, userId: number, addNoteDto: AddBookingNoteDto) {
    const booking = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    
    const note = this.bookingNoteRepository.create({
      bookingId: booking.id,
      userId,
      ...addNoteDto
    });
    
    return this.bookingNoteRepository.save(note);
  }

  async getNotes(id: number) {
    const booking = await this.findOne(id);
    
    return this.bookingNoteRepository.find({
      where: { bookingId: booking.id },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async changeStatus(id: number, status: BookingStatus) {
    const booking = await this.findOne(id);
    
    booking.status = status;
    
    // 根据状态更新预约相关字段
    switch (status) {
      case BookingStatus.CONFIRMED:
        booking.isConfirmed = true;
        break;
      case BookingStatus.CANCELLED:
        booking.isCancelled = true;
        booking.cancelledAt = new Date();
        break;
      case BookingStatus.NO_SHOW:
        booking.isNoShow = true;
        break;
    }
    
    return this.bookingRepository.save(booking);
  }

  async checkPhotographerAvailability(
    photographerId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: number
  ) {
    // 验证摄影师是否存在
    const photographer = await this.photographerRepository.findOne({
      where: { id: photographerId }
    });
    
    if (!photographer) {
      throw new NotFoundException(`Photographer with ID ${photographerId} not found`);
    }
    
    if (!photographer.isActive) {
      throw new BadRequestException(`Photographer ${photographer.name} is not active`);
    }
    
    // 检查摄影师在指定时间是否有其他预约
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.photographerId = :photographerId', { photographerId })
      .andWhere('booking.date = :date', { date })
      .andWhere('booking.isCancelled = false')
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime }
      );
    
    // 排除当前预约
    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }
    
    const conflictingBookings = await queryBuilder.getCount();
    
    if (conflictingBookings > 0) {
      throw new ConflictException(`Photographer is not available at the requested time`);
    }
    
    return true;
  }

  async checkStudioAvailability(
    studioId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: number
  ) {
    // 验证工作室是否存在
    const studio = await this.studioRepository.findOne({
      where: { id: studioId }
    });
    
    if (!studio) {
      throw new NotFoundException(`Studio with ID ${studioId} not found`);
    }
    
    if (!studio.isAvailable) {
      throw new BadRequestException(`Studio ${studio.name} is not available`);
    }
    
    // 检查工作室在指定时间是否有其他预约
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.studioId = :studioId', { studioId })
      .andWhere('booking.date = :date', { date })
      .andWhere('booking.isCancelled = false')
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime }
      );
    
    // 排除当前预约
    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }
    
    const conflictingBookings = await queryBuilder.getCount();
    
    if (conflictingBookings > 0) {
      throw new ConflictException(`Studio is not available at the requested time`);
    }
    
    return true;
  }

  async getAvailableTimeSlots(date: string, photographerId?: number, studioId?: number) {
    // 默认时间段（假设工作时间为9:00-18:00，每个时间段为1小时）
    const defaultStartHour = 9;
    const defaultEndHour = 18;
    const slotDurationMinutes = 60;
    
    // 获取摄影师或工作室的工作时间
    let startHour = defaultStartHour;
    let endHour = defaultEndHour;
    let bufferMinutes = 0;
    
    if (studioId) {
      const studio = await this.studioRepository.findOne({
        where: { id: studioId }
      });
      
      if (studio) {
        if (studio.openTime) {
          const [hours] = studio.openTime.split(':').map(Number);
          startHour = hours;
        }
        
        if (studio.closeTime) {
          const [hours] = studio.closeTime.split(':').map(Number);
          endHour = hours;
        }
        
        bufferMinutes = studio.bufferMinutes || 0;
      }
    }
    
    // 生成所有可能的时间段
    const timeSlots = [];
    const startDate = moment(date);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = startDate.clone().hour(hour).minute(0).second(0);
      const slotEnd = slotStart.clone().add(slotDurationMinutes, 'minutes');
      
      // 检查这个时间段是否已经过去了
      if (slotStart.isBefore(moment())) {
        continue;
      }
      
      timeSlots.push({
        startTime: slotStart.format('HH:mm'),
        endTime: slotEnd.format('HH:mm'),
        isAvailable: true
      });
    }
    
    // 查找所有冲突的预约
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.date = :date', { date })
      .andWhere('booking.isCancelled = false');
    
    if (photographerId) {
      queryBuilder.andWhere('booking.photographerId = :photographerId', { photographerId });
    }
    
    if (studioId) {
      queryBuilder.andWhere('booking.studioId = :studioId', { studioId });
    }
    
    const bookings = await queryBuilder.getMany();
    
    // 标记已被预约的时间段
    for (const timeSlot of timeSlots) {
      const slotStart = moment(`${date}T${timeSlot.startTime}`);
      const slotEnd = moment(`${date}T${timeSlot.endTime}`);
      
      // 添加缓冲时间
      const slotStartWithBuffer = slotStart.clone().subtract(bufferMinutes, 'minutes');
      const slotEndWithBuffer = slotEnd.clone().add(bufferMinutes, 'minutes');
      
      for (const booking of bookings) {
        const bookingStart = moment(`${date}T${booking.startTime}`);
        const bookingEnd = moment(`${date}T${booking.endTime}`);
        
        // 检查预约时间是否与当前时间段冲突
        if (
          bookingStart.isBefore(slotEndWithBuffer) && 
          bookingEnd.isAfter(slotStartWithBuffer)
        ) {
          timeSlot.isAvailable = false;
          break;
        }
      }
    }
    
    return timeSlots;
  }

  async getPhotographerSchedule(photographerId: number, startDate: string, endDate: string) {
    const bookings = await this.bookingRepository.find({
      where: {
        photographerId,
        date: Between(new Date(startDate), new Date(endDate)),
        isCancelled: false
      },
      relations: ['studio', 'user']
    });
    
    // 将预约数据转换为日历事件格式
    return bookings.map(booking => ({
      id: booking.id,
      title: booking.customerName || (booking.user ? booking.user.username : 'Unnamed Customer'),
      start: `${booking.date.toISOString().split('T')[0]}T${booking.startTime}`,
      end: `${booking.date.toISOString().split('T')[0]}T${booking.endTime}`,
      status: booking.status,
      location: booking.studio ? booking.studio.name : undefined,
      shootingType: booking.shootingType,
    }));
  }

  async getStudioSchedule(studioId: number, startDate: string, endDate: string) {
    const bookings = await this.bookingRepository.find({
      where: {
        studioId,
        date: Between(new Date(startDate), new Date(endDate)),
        isCancelled: false
      },
      relations: ['photographer', 'user']
    });
    
    // 将预约数据转换为日历事件格式
    return bookings.map(booking => ({
      id: booking.id,
      title: booking.customerName || (booking.user ? booking.user.username : 'Unnamed Customer'),
      start: `${booking.date.toISOString().split('T')[0]}T${booking.startTime}`,
      end: `${booking.date.toISOString().split('T')[0]}T${booking.endTime}`,
      status: booking.status,
      photographer: booking.photographer ? booking.photographer.name : undefined,
      shootingType: booking.shootingType,
    }));
  }

  async getDailySchedule(date: string) {
    const bookings = await this.bookingRepository.find({
      where: {
        date: new Date(date),
        isCancelled: false
      },
      relations: ['studio', 'photographer', 'user']
    });
    
    // 按摄影师分组
    const photographerSchedule = {};
    
    bookings.forEach(booking => {
      const photographerId = booking.photographerId;
      const photographerName = booking.photographer ? booking.photographer.name : 'Unassigned';
      
      if (!photographerSchedule[photographerId]) {
        photographerSchedule[photographerId] = {
          id: photographerId,
          name: photographerName,
          bookings: []
        };
      }
      
      photographerSchedule[photographerId].bookings.push({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName || (booking.user ? booking.user.username : 'Unnamed Customer'),
        startTime: booking.startTime,
        endTime: booking.endTime,
        studio: booking.studio ? booking.studio.name : undefined,
        status: booking.status,
        shootingType: booking.shootingType,
      });
    });
    
    // 转换为数组
    return Object.values(photographerSchedule).map((schedule: any) => {
      // 按时间排序预约
      schedule.bookings.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
      return schedule;
    });
  }

  async getTodayBookings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.bookingRepository.find({
      where: {
        date: Between(today, tomorrow),
        isCancelled: false
      },
      relations: ['studio', 'photographer', 'user'],
      order: { startTime: 'ASC' }
    });
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date) {
    return this.bookingRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['studio', 'photographer', 'user'],
      order: { date: 'ASC', startTime: 'ASC' }
    });
  }

  async getUpcomingBookings(userId: number, limit: number = 5) {
    const today = new Date();
    
    return this.bookingRepository.find({
      where: {
        userId,
        date: MoreThanOrEqual(today),
        isCancelled: false
      },
      relations: ['studio', 'photographer'],
      order: { date: 'ASC', startTime: 'ASC' },
      take: limit
    });
  }

  async getBookingsStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 获取各种统计数据
    const totalBookings = await this.bookingRepository.count();
    
    const pendingBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.PENDING }
    });
    
    const confirmedBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.CONFIRMED }
    });
    
    const todayBookings = await this.bookingRepository.count({
      where: {
        date: Between(today, tomorrow)
      }
    });
    
    const weekBookings = await this.bookingRepository.count({
      where: {
        date: Between(startOfWeek, endOfWeek)
      }
    });
    
    const monthBookings = await this.bookingRepository.count({
      where: {
        date: Between(startOfMonth, endOfMonth)
      }
    });
    
    const cancelledBookings = await this.bookingRepository.count({
      where: { isCancelled: true }
    });
    
    const noShowBookings = await this.bookingRepository.count({
      where: { isNoShow: true }
    });
    
    // 计算转化率（已确认/总预约）
    const conversionRate = totalBookings > 0 
      ? (confirmedBookings / totalBookings * 100).toFixed(2) 
      : 0;
    
    // 计算取消率
    const cancellationRate = totalBookings > 0 
      ? (cancelledBookings / totalBookings * 100).toFixed(2) 
      : 0;
    
    // 计算未到率
    const noShowRate = confirmedBookings > 0 
      ? (noShowBookings / confirmedBookings * 100).toFixed(2) 
      : 0;
    
    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      cancelledBookings,
      noShowBookings,
      conversionRate,
      cancellationRate,
      noShowRate
    };
  }

  // 生成唯一的预约号
  private async generateBookingNumber(): Promise<string> {
    const dateStr = moment().format('YYYYMMDD');
    const randomStr = nanoid(6).toUpperCase(); // 6位大写字母和数字的随机字符串
    
    const bookingNumber = `B${dateStr}-${randomStr}`;
    
    // 检查预约号是否已经存在
    const existingBooking = await this.bookingRepository.findOne({
      where: { bookingNumber }
    });
    
    if (existingBooking) {
      // 如果已存在，递归调用以生成新的预约号
      return this.generateBookingNumber();
    }
    
    return bookingNumber;
  }
}
