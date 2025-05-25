// ... other imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberLevelLog } from './entities/member-level-log.entity';
import { MemberLevel } from './entities/member-level.entity'; // 假设存在
import { User } from '../user/entities/user.entity'; // 假设存在
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberLevelLog, 
      MemberLevel, // 如果有 MemberLevel 实体
      // ...其他会员模块的实体
    ]),
    // ...其他模块
  ],
  // ... controllers, providers
})
export class MembershipModule {}
