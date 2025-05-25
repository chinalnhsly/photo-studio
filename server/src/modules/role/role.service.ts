import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll() {
    return this.roleRepo.find();
  }

  async findOne(id: number) {
    return this.roleRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Role>) {
    return this.roleRepo.save(data);
  }

  async update(id: number, data: Partial<Role>) {
    await this.roleRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.roleRepo.delete(id);
    return { success: true };
  }
}
