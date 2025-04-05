import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentFilterDto } from './dto/appointment.dto';
import { Prisma, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // 检查时段是否可用
    const isTimeSlotAvailable = await this.checkTimeSlotAvailability(
      createAppointmentDto.serviceId,
      new Date(createAppointmentDto.date)
    );

    if (!isTimeSlotAvailable) {
      throw new BadRequestException('该时段已被预约');
    }

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        date: new Date(createAppointmentDto.date),
        status: AppointmentStatus.PENDING,
      },
      include: {
        user: true,
        service: true,
      },
    });
  }

  async findAll(filters: AppointmentFilterDto) {
    const where: Prisma.AppointmentWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.serviceId && { serviceId: filters.serviceId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && filters.endDate && {
        date: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          user: true,
          service: true,
        },
        orderBy: {
          date: 'desc',
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { items, total };
  }

  private async checkTimeSlotAvailability(serviceId: number, date: Date): Promise<boolean> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('服务不存在');
    }

    const startTime = date;
    const endTime = new Date(date.getTime() + service.duration * 60000);

    const conflictingAppointments = await this.prisma.appointment.count({
      where: {
        serviceId,
        date: {
          gte: startTime,
          lt: endTime,
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
    });

    return conflictingAppointments === 0;
  }

  // ... 其他方法实现 ...
}
