export interface TagCount {
  tag: string;
  count: number;
}

export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  withImageReviews: number;
  satisfactionRate: number;
  ratingDistribution: Record<string, number>;
  reviewsGrowthRate: number;
  tagFrequency: TagCount[];
}
