import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoTaskDto, UpdatePhotoTaskDto, PhotoTaskFilterDto } from './dto/photo-task.dto';
import { Prisma, PhotoTaskStatus } from '@prisma/client';

@Injectable()
export class PhotoTasksService {
  constructor(private prisma: PrismaService) {}

  async create(createPhotoTaskDto: CreatePhotoTaskDto) {
    const { customerId, taskDate, ...rest } = createPhotoTaskDto;

    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user) {
      throw new NotFoundException(`User #${customerId} not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      return tx.photoTask.create({
        data: {
          customerId,
          taskDate: new Date(taskDate),
          status: PhotoTaskStatus.PENDING,
          ...rest,
        },
        include: {
          customer: true,
        },
      });
    });
  }

  async findAll(filters: PhotoTaskFilterDto) {
    const { page = 1, pageSize = 10, startDate, endDate, ...rest } = filters;
    const skip = (page - 1) * pageSize;

    const where: Prisma.PhotoTaskWhereInput = {
      ...rest,
      ...(startDate && endDate && {
        taskDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.photoTask.findMany({
        where,
        include: {
          customer: true,
        },
        skip,
        take: pageSize,
        orderBy: {
          taskDate: 'asc',
        },
      }),
      this.prisma.photoTask.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // ... 其他方法实现
}
