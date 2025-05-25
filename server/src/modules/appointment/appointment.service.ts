import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { Product } from '../product/entities/product.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DateInfo, TimeSlotInfo } from './interfaces/date-info.interface';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * 获取产品可用的预约日期和时间段
   */
  async getAvailableDates(productId: number): Promise<DateInfo[]> {
    // 查找产品信息
    const product = await this.productRepository.findOne({ 
      where: { id: productId } 
    });
    
    if (!product) {
      throw new NotFoundException('产品不存在');
    }

    // 获取所有时间段配置
    const timeSlots = await this.getTimeSlots();
    
    // 获取接下来90天的日期范围
    const startDate = moment().startOf('day');
    const endDate = moment().add(90, 'days').endOf('day');
    
    // 查询该日期范围内的所有预约记录
    const appointments = await this.appointmentRepository.find({
      where: {
        product: { id: productId },
        appointmentDate: Between(startDate.toDate(), endDate.toDate())
      }
    });
    
    // 根据已预约记录，计算每天每个时间段的可用状态
    const result: DateInfo[] = [];
    const currentDate = startDate.clone();
    
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      const dateString = currentDate.format('YYYY-MM-DD');
      
      // 检查当天是否可预约（可能有休息日等限制）
      const available = this.isDateAvailable(currentDate, product);
      
      // 修改检查逻辑
      const fullBooked = timeSlots.every(slot => !slot.isAvailable);

      result.push({
        date: dateString,
        isAvailable: true,  // 修正属性名
        fullBooked,
        price: product.price,
        weekday: currentDate.day().toString(),
        timeSlots
      });
      
      currentDate.add(1, 'day');
    }
    
    return result;
  }

  /**
   * 获取可用时间槽
   */
  async getAvailableSlots(params: { productId: number, date: string }) {
    const timeSlots = await this.getTimeSlots();

    return {
      date: params.date,
      isAvailable: true,
      fullBooked: false,
      timeSlots
    };
  }

  /**
   * 创建预约
   */
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { productId, date, timeSlotId } = createAppointmentDto;
    
    // 检查产品是否存在
    const product = await this.productRepository.findOne({ 
      where: { id: productId } 
    });
    
    if (!product) {
      throw new NotFoundException('产品不存在');
    }
    
    // 检查时间段是否可用
    const available = await this.checkTimeSlotAvailability(productId, date, timeSlotId);
    
    if (!available) {
      throw new ConflictException('该时间段已被预约或不可用');
    }
    
    // 创建预约记录
    const appointment = this.appointmentRepository.create({
      product,
      appointmentDate: moment(date).toDate(),
      timeSlotId,
      customerName: createAppointmentDto.customerName,
      customerPhone: createAppointmentDto.customerPhone,
      remark: createAppointmentDto.remark,
      status: 'pending' // 初始状态为待确认
    });
    
    return this.appointmentRepository.save(appointment);
  }

  /**
   * 检查时间段是否可用
   */
  async checkTimeSlotAvailability(
    productId: number, 
    date: string, 
    timeSlotId: number  // 修改为 number 类型
  ): Promise<boolean> {
    // 查找产品信息
    const product = await this.productRepository.findOne({ 
      where: { id: productId } 
    });
    
    if (!product) {
      return false;
    }
    
    // 检查日期是否可用
    const momentDate = moment(date);
    if (!this.isDateAvailable(momentDate, product)) {
      return false;
    }
    
    // 检查是否已有该时间段的预约
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        product: { id: productId },
        appointmentDate: momentDate.toDate(),
        timeSlotId
      }
    });
    
    return !existingAppointment;
  }

  /**
   * 判断日期是否可预约
   * 这里可以实现各种业务规则，比如:
   * 1. 休息日不可预约
   * 2. 今天之前的日期不可预约
   * 3. 特殊节日不可预约等
   */
  private isDateAvailable(date: moment.Moment, product: Product): boolean {
    // 1. 今天之前的日期不可预约
    if (date.isBefore(moment().startOf('day'))) {
      return false;
    }
    
    // 2. 超过产品最大可预约天数的日期不可预约
    const maxDaysAhead = 90; // 最多可预约未来90天
    if (date.isAfter(moment().add(maxDaysAhead, 'days'))) {
      return false;
    }
    
    // 3. 周末是否可预约
    const isWeekend = date.day() === 0 || date.day() === 6;
    if (isWeekend && !product.availableOnWeekends) {
      return false;
    }
    
    return true;
  }

  /**
   * 获取时间段信息
   */
  async getTimeSlots(): Promise<TimeSlotInfo[]> {
    const timeSlots = await this.timeSlotRepository.find();
    
    const timeSlotInfos: TimeSlotInfo[] = timeSlots.map(slot => ({
      id: slot.id,
      startTime: slot.startTime.toISOString(),  // 转换为 ISO 字符串
      endTime: slot.endTime.toISOString(),      // 转换为 ISO 字符串
      isAvailable: slot.isAvailable,
      price: slot.price
    }));

    return timeSlotInfos;
  }
}
