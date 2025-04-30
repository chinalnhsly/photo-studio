import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const timeSlots = await this.timeSlotRepository.find();
    
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
      
      // 计算每个时间段的可用状态
      const timeSlotInfos: TimeSlotInfo[] = timeSlots.map(slot => {
        const isBooked = appointments.some(
          app => 
            moment(app.appointmentDate).format('YYYY-MM-DD') === dateString && 
            app.timeSlotId === slot.id
        );
        
        return {
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          available: available && !isBooked,
          price: product.price, // 这里可以根据不同时间段设置不同价格
        };
      });
      
      // 判断当天是否全部时间段都已约满
      const fullBooked = available && timeSlotInfos.every(slot => !slot.available);
      
      result.push({
        date: dateString,
        available,
        fullBooked,
        price: product.price,
        weekday: currentDate.day().toString(),
        timeSlots: timeSlotInfos
      });
      
      currentDate.add(1, 'day');
    }
    
    return result;
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
    timeSlotId: string
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
    
    // 3. 周末是否可预约（假设是产品配置）
    const isWeekend = date.day() === 0 || date.day() === 6;
    if (isWeekend && !product.availableOnWeekends) {
      return false;
    }
    
    // 4. 其他自定义规则...
    
    return true;
  }
}
