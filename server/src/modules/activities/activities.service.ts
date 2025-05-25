import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityRegistration } from './entities/activity-registration.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(ActivityRegistration)
    private readonly registrationRepository: Repository<ActivityRegistration>,
  ) {}

  async findAll(page: number, limit: number) {
    const [data, total] = await this.activityRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { start_time: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) throw new NotFoundException('活动不存在');
    return activity;
  }

  async register(activityId: number, userId: number) {
    const exists = await this.registrationRepository.findOne({ where: { activity_id: activityId, user_id: userId } });
    if (exists) throw new ConflictException('已报名该活动');
    const registration = this.registrationRepository.create({ activity_id: activityId, user_id: userId });
    return this.registrationRepository.save(registration);
  }
}
