import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async findAll() {
    return this.menuRepo.find();
  }

  async findOne(id: number) {
    return this.menuRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Menu>) {
    return this.menuRepo.save(data);
  }

  async update(id: number, data: Partial<Menu>) {
    await this.menuRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.menuRepo.delete(id);
    return { success: true };
  }
}
