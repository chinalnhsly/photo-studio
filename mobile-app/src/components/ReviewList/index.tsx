import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtRate, AtTag, AtLoadMore, AtIcon } from 'taro-ui';
import { getProductReviews } from '../../services/review';
import { formatDate } from '../../utils/format';
import RatingTags from '../RatingTags';
import './index.scss';

interface ReviewListProps {
  productId: number;
  maxHeight?: string;
  showHeader?: boolean;
  showMoreButton?: boolean;
  limit?: number;
  filter?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  maxHeight = '600px',
  showHeader = true,
  showMoreButton = true,
  limit = 5,
  filter = 'all'
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    totalCount: 0,
    averageRating: 0,
    satisfactionRate: 0,
    distribution: {
      good: 0,
      neutral: 0,
      bad: 0,
      withImages: 0
    }
  });
  const [currentFilter, setCurrentFilter] = useState(filter);

  useEffect(() => {
    fetchReviews(1, currentFilter);
  }, [productId, currentFilter]);

  // 获取评价列表
  const fetchReviews = async (pageNum = 1, filterType = 'all') => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await getProductReviews(productId, {
        page: pageNum,
        limit,
        filter: filterType,
        withStats: pageNum === 1 // 只在第一页请求时获取统计信息
      });

      if (pageNum === 1) {
        setReviews(res.data.reviews || []);
        
        // 处理统计信息
        if (res.data.stats) {
          // 根据评分分布生成过滤标签需要的分布数据
          const distribution = {
            good: 0,
            neutral: 0,
            bad: 0,
            withImages: 0
          };
          
          // 计算好评、中评、差评
          const ratingDist = res.data.stats.ratingDistribution || {};
          distribution.good = (ratingDist[5] || 0) + (ratingDist[4] || 0);
          distribution.neutral = ratingDist[3] || 0;
          distribution.bad = (ratingDist[2] || 0) + (ratingDist[1] || 0);
          
          // 有图评价数量
          distribution.withImages = res.data.stats.withImageReviews || 0;
          
          setStats({
            ...res.data.stats,
            distribution
          });
        }
      } else {
        setReviews(prev => [...prev, ...(res.data.reviews || [])]);
      }

      setHasMore((res.data.reviews || []).length === limit);
      setPage(pageNum);
    } catch (error) {
      console.error('获取评价失败:', error);
      Taro.showToast({
        title: '获取评价失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 加载更多评价
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchReviews(page + 1, currentFilter);
    }
  };

  // 处理筛选变化
  const handleFilterChange = (value: string) => {
    setCurrentFilter(value);
  };

  // 查看所有评价
  const handleViewAllReviews = () => {
    Taro.navigateTo({
      url: `/pages/product/reviews/index?productId=${productId}`
    });
  };

  // 查看评价详情
  const viewReviewDetail = (reviewId: number) => {
    Taro.navigateTo({
      url: `/pages/product/reviews/detail?id=${reviewId}`
    });
  };

  // 预览评价图片
  const previewImages = (urls: string[], current: string) => {
    Taro.previewImage({
      urls,
      current
    });
  };

  if (loading) {
    return (
      <View className="review-list-loading">
        <Text>评价加载中...</Text>
      </View>
    );
  }

  return (
    <View className="review-list-component">
      {showHeader && (
        <View className="review-header">
          <View className="review-stats">
            <View className="stats-item">
              <Text className="stats-value">{stats.averageRating.toFixed(1)}</Text>
              <Text className="stats-label">综合评分</Text>
            </View>
            <View className="stats-item">
              <Text className="stats-value">{stats.satisfactionRate}%</Text>
              <Text className="stats-label">满意度</Text>
            </View>
            <View className="stats-item">
              <Text className="stats-value">{stats.totalCount}</Text>
              <Text className="stats-label">评价数</Text>
            </View>
          </View>
          
          {/* 评分筛选标签 */}
          <RatingTags 
            distribution={stats.distribution}
            totalCount={stats.totalCount}
            onChange={handleFilterChange}
            value={currentFilter}
          />
        </View>
      )}

      {reviews.length === 0 ? (
        <View className="empty-review">
          <Image className="empty-icon" src="/assets/images/empty-review.png" />
          <Text className="empty-text">暂无评价</Text>
        </View>
      ) : (
        <ScrollView
          scrollY
          className="review-scroll"
          style={{ maxHeight }}
          onScrollToLower={loadMore}
        >
          {reviews.map(review => (
            <View 
              key={review.id} 
              className="review-item"
              onClick={() => viewReviewDetail(review.id)}
            >
              <View className="review-user">
                <Image
                  className="user-avatar"
                  src={review.userAvatar || '/assets/images/default-avatar.png'}
                />
                <View className="user-info">
                  <Text className="user-name">{review.userName || '匿名用户'}</Text>
                  <Text className="review-time">{formatDate(review.createdAt)}</Text>
                </View>
                <AtRate
                  value={review.rating}
                  size={12}
                  max={5}
                  className="review-rating"
                />
              </View>

              <View className="review-content">
                <Text className="review-text">{review.content}</Text>
                
                {review.tags && review.tags.length > 0 && (
                  <View className="review-tags">
                    {review.tags.map((tag, index) => (
                      <AtTag key={index} size="small" className="review-tag">
                        {tag}
                      </AtTag>
                    ))}
                  </View>
                )}
                
                {review.images && review.images.length > 0 && (
                  <View className="review-images">
                    {review.images.map((image, index) => (
                      <Image
                        key={index}
                        className="review-image"
                        src={image}
                        mode="aspectFill"
                        onClick={(e) => {
                          e.stopPropagation();
                          previewImages(review.images, image);
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>

              {review.reply && (
                <View className="reply-content">
                  <View className="reply-header">
                    <AtIcon value="message" size="14" color="#666" />
                    <Text className="reply-title">商家回复：</Text>
                  </View>
                  <Text className="reply-text">{review.reply}</Text>
                </View>
              )}
            </View>
          ))}

          {loadingMore && <AtLoadMore status="loading" />}
          
          {!hasMore && reviews.length > 0 && !showMoreButton && (
            <View className="no-more">
              <Text>没有更多评价了</Text>
            </View>
          )}
        </ScrollView>
      )}

      {showMoreButton && reviews.length > 0 && (
        <View className="view-more-button" onClick={handleViewAllReviews}>
          <Text>查看全部{stats.totalCount}条评价</Text>
          <AtIcon value="chevron-right" size="16" color="#666" />
        </View>
      )}
    </View>
  );
};

export default ReviewList;
