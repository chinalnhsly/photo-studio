import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';
import { MemberLevel } from './entities/member-level.entity';
import { MemberCard } from './entities/member-card.entity';
import { PointLog } from './entities/point-log.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberLevel,
      MemberCard,
      PointLog,
      User
    ])
  ],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService]
})
export class MemberModule {}
