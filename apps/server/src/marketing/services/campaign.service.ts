import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignFilterDto } from '../dto/campaign.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.$transaction(async (tx) => {
      return tx.marketingCampaign.create({
        data: {
          ...createCampaignDto,
          startDate: new Date(createCampaignDto.startDate),
          endDate: new Date(createCampaignDto.endDate),
        },
        include: {
          coupons: true,
        },
      });
    });
  }

  async findAll(filters: CampaignFilterDto) {
    const where: Prisma.MarketingCampaignWhereInput = {
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(typeof filters.isActive !== 'undefined' && { 
        isActive: filters.isActive 
      }),
    };

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [items, total] = await Promise.all([
      this.prisma.marketingCampaign.findMany({
        where,
        include: { coupons: true },
        orderBy: { startDate: 'desc' },
        skip,
        take
      }),
      this.prisma.marketingCampaign.count({ where })
    ]);

    return { 
      items,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil(total / filters.pageSize)
    };
  }

  async findOne(id: number) {
    const campaign = await this.prisma.marketingCampaign.findUnique({
      where: { id },
      include: { coupons: true }
    });

    if (!campaign) {
      throw new NotFoundException(`Marketing Campaign #${id} not found`);
    }
    return campaign;
  }

  async update(id: number, updateDto: UpdateCampaignDto) {
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.startDate && { startDate: new Date(updateDto.startDate) }),
        ...(updateDto.endDate && { endDate: new Date(updateDto.endDate) })
      },
      include: { coupons: true }
    });
  }

  async remove(id: number) {
    return this.prisma.marketingCampaign.delete({
      where: { id }
    });
  }
}