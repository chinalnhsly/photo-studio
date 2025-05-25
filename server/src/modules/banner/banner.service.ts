import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  /**
   * 获取所有轮播图
   * @param position 位置筛选
   * @returns 轮播图列表
   */
  async findAll(position?: string): Promise<Banner[]> {
    const query = this.bannerRepository.createQueryBuilder('banner')
      .where('banner.isActive = :isActive', { isActive: true })
      .orderBy('banner.sortOrder', 'ASC');

    if (position) {
      query.andWhere('banner.position = :position', { position });
    }

    return query.getMany();
  }

  /**
   * 获取单个轮播图
   * @param id 轮播图ID
   * @returns 轮播图信息
   */
  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`ID为${id}的轮播图不存在`);
    }
    return banner;
  }

  /**
   * 创建轮播图
   * @param createBannerDto 创建参数
   * @returns 创建的轮播图信息
   */
  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    // 获取当前最大排序值
    const maxOrderBanner = await this.bannerRepository.findOne({
      order: { sortOrder: 'DESC' },
    });
    
    const banner = this.bannerRepository.create({
      ...createBannerDto,
      sortOrder: maxOrderBanner ? maxOrderBanner.sortOrder + 1 : 0,
    });
    
    return this.bannerRepository.save(banner);
  }

  /**
   * 更新轮播图
   * @param id 轮播图ID
   * @param updateBannerDto 更新参数
   * @returns 更新后的轮播图信息
   */
  async update(id: number, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.findOne(id);
    
    // 合并更新数据
    Object.assign(banner, updateBannerDto);
    
    return this.bannerRepository.save(banner);
  }

  /**
   * 删除轮播图
   * @param id 轮播图ID
   */
  async remove(id: number): Promise<void> {
    const banner = await this.findOne(id);
    await this.bannerRepository.remove(banner);
  }

  /**
   * 批量更新轮播图顺序
   * @param ids 轮播图ID数组(按显示顺序排列)
   */
  async updateOrder(ids: number[]): Promise<void> {
    const queryRunner = this.bannerRepository.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (let i = 0; i < ids.length; i++) {
        await queryRunner.manager.update(Banner, ids[i], { sortOrder: i });
      }
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  
  /**
   * 切换轮播图激活状态
   * @param id 轮播图ID
   * @returns 更新后的轮播图
   */
  async toggleActive(id: number): Promise<Banner> {
    const banner = await this.findOne(id);
    banner.isActive = !banner.isActive;
    return this.bannerRepository.save(banner);
  }
  
  /**
   * 获取管理后台轮播图列表(包含未激活)
   */
  async findAllForAdmin(): Promise<Banner[]> {
    return this.bannerRepository.find({ 
      order: { sortOrder: 'ASC', createdAt: 'DESC' } 
    });
  }
}
