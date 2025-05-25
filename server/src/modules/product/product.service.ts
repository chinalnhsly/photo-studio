import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  async findAll(page: number, limit: number) {
    // TODO: 查询商品列表，分页
    return { data: [], total: 0, page, limit };
  }

  async findOne(id: number) {
    // TODO: 查询单个商品详情
    return { id, name: '示例商品', price: 100 };
  }
}
