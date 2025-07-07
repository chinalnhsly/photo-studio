import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photographer } from './entities/photographer.entity';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';

@Injectable()
export class PhotographerService {
  constructor(
    @InjectRepository(Photographer)
    private photographerRepository: Repository<Photographer>,
  ) {}

  async create(createPhotographerDto: CreatePhotographerDto): Promise<Photographer> {
    const photographer = this.photographerRepository.create(createPhotographerDto);
    return this.photographerRepository.save(photographer);
  }

  async findAll(): Promise<Photographer[]> {
    return this.photographerRepository.find();
  }

  async findOne(id: number): Promise<Photographer> {
    const photographer = await this.photographerRepository.findOne({
      where: { id }
    });
    
    if (!photographer) {
      throw new NotFoundException(`Photographer with ID ${id} not found`);
    }
    
    return photographer;
  }

  async update(id: number, updatePhotographerDto: UpdatePhotographerDto): Promise<Photographer> {
    const photographer = await this.findOne(id);
    
    // 更新字段
    Object.assign(photographer, updatePhotographerDto);
    
    return this.photographerRepository.save(photographer);
  }

  async remove(id: number): Promise<void> {
    const photographer = await this.findOne(id);
    await this.photographerRepository.remove(photographer);
  }

  // 简单的搜索方法
  async search(query: string): Promise<Photographer[]> {
    return this.photographerRepository
      .createQueryBuilder('photographer')
      .where('photographer.name ILIKE :query OR photographer.bio ILIKE :query', { 
        query: `%${query}%` 
      })
      .getMany();
  }

  // 获取可用的摄影师
  async getAvailablePhotographers(): Promise<Photographer[]> {
    return this.photographerRepository.find({
      where: { isActive: true }
    });
  }
}
