import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async findAll() {
    return this.permissionRepo.find();
  }

  async findOne(id: number) {
    return this.permissionRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Permission>) {
    return this.permissionRepo.save(data);
  }

  async update(id: number, data: Partial<Permission>) {
    await this.permissionRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.permissionRepo.delete(id);
    return { success: true };
  }
}
