import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Photographer } from './entities/photographer.entity';
import { PhotographStyle } from './entities/photograph-style.entity';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';
import { BookingSlot } from '../booking/entities/booking-slot.entity';

@Injectable()
export class PhotographerService {
  constructor(
    @InjectRepository(Photographer)
    private photographerRepository: Repository<Photographer>,
    @InjectRepository(PhotographStyle)
    private styleRepository: Repository<PhotographStyle>,
    @InjectRepository(BookingSlot)
    private slotRepository: Repository<BookingSlot>,
  ) {}

  // 获取所有摄影师
  async findAll(options?: any) {
    const { isActive, specialtyId, page = 1, limit = 10 } = options || {};
    
    const queryBuilder = this.photographerRepository
      .createQueryBuilder('photographer')
      .leftJoinAndSelect('photographer.specialties', 'specialties');
    
    // 过滤条件
    if (isActive !== undefined) {
      queryBuilder.andWhere('photographer.isActive = :isActive', { isActive });
    }
    
    if (specialtyId) {
      queryBuilder.andWhere('specialties.id = :specialtyId', { specialtyId });
    }
    
    // 分页
    const skip = (page - 1) * limit;
    
    queryBuilder.skip(skip).take(limit);
    
    // 排序
    queryBuilder.orderBy('photographer.totalBookings', 'DESC');
    
    // 获取总数
    const total = await queryBuilder.getCount();
    
    // 获取数据
    const items = await queryBuilder.getMany();
    
    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 获取单个摄影师详情
  async findOne(id: number) {
    const photographer = await this.photographerRepository.findOne({
      where: { id },
      relations: ['specialties']
    });
    
    if (!photographer) {
      throw new NotFoundException(`未找到ID为${id}的摄影师`);
    }
    
    return photographer;
  }

  // 创建摄影师
  async create(createDto: CreatePhotographerDto) {
    // 处理专业特长
    let specialties = [];
    if (createDto.specialtyIds && createDto.specialtyIds.length > 0) {
      specialties = await this.styleRepository.find({
        where: { id: In(createDto.specialtyIds) }
      });
    }
    
    // 创建摄影师对象
    const photographer = this.photographerRepository.create({
      ...createDto,
      specialties,
      portfolioImages: createDto.portfolioImages || []
    });
    
    // 保存
    return this.photographerRepository.save(photographer);
  }

  // 更新摄影师
  async update(id: number, updateDto: UpdatePhotographerDto) {
    const photographer = await this.findOne(id);
    
    // 处理专业特长
    if (updateDto.specialtyIds) {
      photographer.specialties = await this.styleRepository.find({
        where: { id: In(updateDto.specialtyIds) }
      });
    }
    
    // 更新其他字段
    Object.assign(photographer, {
      ...updateDto,
      specialtyIds: undefined // 清除非实体字段
    });
    
    // 保存
    return this.photographerRepository.save(photographer);
  }

  // 删除摄影师
  async remove(id: number) {
    const photographer = await this.findOne(id);
    
    // 检查是否有关联的预约
    const existingSlots = await this.slotRepository.findOne({
      where: { photographerId: id, isAvailable: false }
    });
    
    if (existingSlots) {
      throw new BadRequestException('该摄影师有未完成的预约，无法删除');
    }
    
    return this.photographerRepository.remove(photographer);
  }

  // 获取摄影师可用时间段
  async getAvailableSlots(photographerId: number, startDate: Date, endDate: Date) {
    // 验证摄影师是否存在
    await this.findOne(photographerId);
    
    // 获取可用时间段
    const slots = await this.slotRepository.find({
      where: {
        photographerId,
        date: Between(startDate, endDate),
        isAvailable: true
      },
      order: {
        date: 'ASC',
        startTime: 'ASC'
      }
    });
    
    return slots;
  }

  // 获取所有风格/特长
  async findAllStyles() {
    return this.styleRepository.find({
      order: { sortOrder: 'ASC' }
    });
  }

  // 创建风格/特长
  async createStyle(createStyleDto: any) {
    const style = this.styleRepository.create(createStyleDto);
    return this.styleRepository.save(style);
  }

  // 更新风格/特长
  async updateStyle(id: number, updateStyleDto: any) {
    const style = await this.styleRepository.findOne({
      where: { id }
    });
    
    if (!style) {
      throw new NotFoundException(`未找到ID为${id}的风格/特长`);
    }
    
    Object.assign(style, updateStyleDto);
    return this.styleRepository.save(style);
  }

  // 删除风格/特长
  async removeStyle(id: number) {
    const style = await this.styleRepository.findOne({
      where: { id }
    });
    
    if (!style) {
      throw new NotFoundException(`未找到ID为${id}的风格/特长`);
    }
    
    return this.styleRepository.remove(style);
  }
  
  // 统计摄影师工作量
  async getPhotographerWorkload(id: number, startDate: Date, endDate: Date) {
    // 验证摄影师是否存在
    await this.findOne(id);
    
    // 获取已预约的时间段
    const bookedSlots = await this.slotRepository.find({
      where: {
        photographerId: id,
        date: Between(startDate, endDate),
        isAvailable: false
      },
      order: {
        date: 'ASC'
      }
    });
    
    // 按日期分组统计
    const dailyStats = bookedSlots.reduce((acc, slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];
      
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          count: 0,
          slots: []
        };
      }
      
      acc[dateStr].count++;
      acc[dateStr].slots.push({
        startTime: slot.startTime,
        endTime: slot.endTime
      });
      
      return acc;
    }, {});
    
    return Object.values(dailyStats);
  }
  
  // 获取热门摄影师
  async getPopularPhotographers(limit: number = 5) {
    return this.photographerRepository.find({
      where: { isActive: true },
      order: {
        totalBookings: 'DESC',
        rating: 'DESC'
      },
      take: limit
    });
  }
}
