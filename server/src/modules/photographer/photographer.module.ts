import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photographer } from './entities/photographer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photographer])
  ],
  exports: [TypeOrmModule] // 导出 TypeOrmModule 以便其他模块使用
})
export class PhotographerModule {}
