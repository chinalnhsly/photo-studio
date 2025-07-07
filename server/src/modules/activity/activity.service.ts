import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities/activity.entity';
import { ActivityRegistration } from '../../entities/activity-registration.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityRegistration)
    private readonly registrationRepo: Repository<ActivityRegistration>,
  ) {}

  async findAll() {
    return this.activityRepo.find();
  }

  async findOne(id: number) {
    return this.activityRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Activity>) {
    return this.activityRepo.save(data);
  }

  async update(id: number, data: Partial<Activity>) {
    await this.activityRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.activityRepo.delete(id);
    return { success: true };
  }

  async register(activity_id: number, user_id: number) {
    const exists = await this.registrationRepo.findOne({ where: { activity_id, user_id } });
    if (exists) {
      return { success: false, message: '已报名' };
    }
    const registration = this.registrationRepo.create({ activity_id, user_id });
    await this.registrationRepo.save(registration);
    return { success: true };
  }
}
