import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImport } from '../../entities/product-import.entity';

@Injectable()
export class ProductImportService {
  constructor(
    @InjectRepository(ProductImport)
    private readonly importRepo: Repository<ProductImport>,
  ) {}

  async createRecord(data: Partial<ProductImport>) {
    return this.importRepo.save(data);
  }

  async findAll() {
    return this.importRepo.find();
  }
}
