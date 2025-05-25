import { ApiProperty } from '@nestjs/swagger';

export class TagCountDto {
  @ApiProperty({ description: '标签名称' })
  tag: string;

  @ApiProperty({ description: '出现次数' })
  count: number;
}

export class ReviewAnalyticsDto {
  @ApiProperty({ description: '总评价数' })
  totalReviews: number;

  @ApiProperty({ description: '平均评分' })
  averageRating: number;

  @ApiProperty({ description: '有图评价数' })
  withImageReviews: number;

  @ApiProperty({ description: '好评率' })
  satisfactionRate: number;

  @ApiProperty({ description: '评分分布', type: 'object' })
  ratingDistribution: Record<string, number>;

  @ApiProperty({ description: '环比增长率' })
  reviewsGrowthRate: number;

  @ApiProperty({ description: '标签频率统计', type: [TagCountDto] })
  tagFrequency: TagCountDto[];
}
