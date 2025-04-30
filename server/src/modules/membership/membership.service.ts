import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { MemberLevel } from './entities/member-level.entity';
import { UserMembership } from './entities/user-membership.entity';
import { PointRecord } from './entities/point-record.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import * as moment from 'moment';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MemberLevel)
    private readonly memberLevelRepository: Repository<MemberLevel>,
    @InjectRepository(UserMembership)
    private readonly userMembershipRepository: Repository<UserMembership>,
    @InjectRepository(PointRecord)
    private readonly pointRecordRepository: Repository<PointRecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取所有会员等级
   */
  async getAllMemberLevels(): Promise<MemberLevel[]> {
    return this.memberLevelRepository.find({
      order: { requiredPoints: 'ASC' }
    });
  }

  /**
   * 获取用户会员信息
   * @param userId 用户ID
   */
  async getUserMembership(userId: number): Promise<UserMembership> {
    const userMembership = await this.userMembershipRepository.findOne({
      where: { userId },
      relations: ['memberLevel']
    });

    if (!userMembership) {
      // 如果用户还没有会员信息，则初始化一个
      const defaultLevel = await this.memberLevelRepository.findOne({
        where: { requiredPoints: 0 } // 默认等级
      });

      if (!defaultLevel) {
        throw new NotFoundException('会员默认等级未配置');
      }

      const newMembership = this.userMembershipRepository.create({
        userId,
        levelId: defaultLevel.id,
        points: 0,
        totalPoints: 0
      });

      return this.userMembershipRepository.save(newMembership);
    }

    return userMembership;
  }

  /**
   * 更新用户会员等级
   * @param userId 用户ID
   */
  async updateUserMemberLevel(userId: number): Promise<UserMembership> {
    const userMembership = await this.getUserMembership(userId);
    
    // 查找符合用户积分的最高等级
    const eligibleLevel = await this.memberLevelRepository.findOne({
      where: { requiredPoints: LessThan(userMembership.totalPoints) },
      order: { requiredPoints: 'DESC' }
    });

    if (eligibleLevel && eligibleLevel.id !== userMembership.levelId) {
      userMembership.levelId = eligibleLevel.id;
      userMembership.memberLevel = eligibleLevel;
      
      await this.userMembershipRepository.save(userMembership);
      
      // 记录升级日志
      await this.createPointRecord(userId, 0, 'adjust', `会员升级到${eligibleLevel.name}`);
    }

    return userMembership;
  }

  /**
   * 添加积分
   * @param userId 用户ID
   * @param points 积分数量
   * @param type 记录类型
   * @param description 描述
   * @param orderNumber 订单号(可选)
   */
  async addPoints(
    userId: number,
    points: number,
    type: 'earn' | 'adjust',
    description: string,
    orderNumber?: string
  ): Promise<UserMembership> {
    if (points <= 0) {
      throw new BadRequestException('积分必须为正数');
    }

    const userMembership = await this.getUserMembership(userId);
    
    // 更新积分
    userMembership.points += points;
    userMembership.totalPoints += points;
    
    await this.userMembershipRepository.save(userMembership);
    
    // 记录积分变动
    await this.createPointRecord(userId, points, type, description, orderNumber);
    
    // 更新会员等级
    return this.updateUserMemberLevel(userId);
  }

  /**
   * 消费积分
   * @param userId 用户ID
   * @param points 积分数量
   * @param description 描述
   * @param orderNumber 订单号(可选)
   */
  async spendPoints(
    userId: number,
    points: number,
    description: string,
    orderNumber?: string
  ): Promise<UserMembership> {
    if (points <= 0) {
      throw new BadRequestException('积分必须为正数');
    }

    const userMembership = await this.getUserMembership(userId);
    
    if (userMembership.points < points) {
      throw new BadRequestException('积分余额不足');
    }
    
    // 扣减积分
    userMembership.points -= points;
    
    await this.userMembershipRepository.save(userMembership);
    
    // 记录积分变动
    await this.createPointRecord(userId, -points, 'spend', description, orderNumber);
    
    return userMembership;
  }

  /**
   * 创建积分记录
   */
  private async createPointRecord(
    userId: number,
    points: number,
    type: 'earn' | 'spend' | 'expire' | 'adjust',
    description: string,
    orderNumber?: string
  ): Promise<PointRecord> {
    const pointRecord = this.pointRecordRepository.create({
      userId,
      points,
      type,
      description,
      orderNumber
    });
    
    return this.pointRecordRepository.save(pointRecord);
  }

  /**
   * 获取用户积分记录
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   */
  async getUserPointRecords(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ records: PointRecord[], total: number }> {
    const [records, total] = await this.pointRecordRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });
    
    return { records, total };
  }

  /**
   * 为订单计算会员折扣
   * @param userId 用户ID
   * @param originalAmount 原始金额
   */
  async calculateMemberDiscount(userId: number, originalAmount: number): Promise<number> {
    const userMembership = await this.getUserMembership(userId);
    
    // 会员折扣率
    const discountRate = userMembership.memberLevel.discountRate || 1;
    
    // 计算折扣金额
    const discountAmount = originalAmount * (1 - discountRate);
    
    return Math.round(discountAmount * 100) / 100; // 保留两位小数
  }

  /**
   * 订单完成后增加积分
   * @param order 订单
   */
  async addPointsForCompletedOrder(order: Order): Promise<void> {
    if (order.status !== 'completed') {
      return;
    }
    
    // 积分比例，例如消费1元获得1积分
    const pointRatio = 1;
    
    // 计算积分 - 不考虑优惠金额部分
    const points = Math.floor(order.totalAmount * pointRatio);
    
    if (points > 0) {
      await this.addPoints(
        order.userId,
        points,
        'earn',
        `订单${order.orderNumber}完成奖励`,
        order.orderNumber
      );
    }
  }

  /**
   * 检查用户是否有生日特权
   * @param userId 用户ID
   */
  async checkBirthdayPrivilege(userId: number): Promise<boolean> {
    const userMembership = await this.getUserMembership(userId);
    
    // 检查是否有生日特权
    if (!userMembership.memberLevel.birthdayPrivilege || !userMembership.birthday) {
      return false;
    }
    
    // 检查今天是否是用户生日
    const today = moment().format('MM-DD');
    const birthday = moment(userMembership.birthday).format('MM-DD');
    
    return today === birthday;
  }

  /**
   * 更新用户生日信息
   * @param userId 用户ID
   * @param birthday 生日
   */
  async updateUserBirthday(userId: number, birthday: Date): Promise<UserMembership> {
    const userMembership = await this.getUserMembership(userId);
    
    userMembership.birthday = birthday;
    
    return this.userMembershipRepository.save(userMembership);
  }
}
