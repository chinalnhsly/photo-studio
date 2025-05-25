import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.activitiesService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(Number(id));
  }

  @Post(':id/register')
  register(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.activitiesService.register(Number(id), body.userId);
  }
}
