import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtRate, AtTag, AtDivider, AtLoadMore } from 'taro-ui';
import { getPhotographerReviews, getReviewStats } from '../services/review';
import './PhotographerReviews.scss';

interface PhotographerReviewsProps {
  photographerId: number;
}

const PhotographerReviews: React.FC<PhotographerReviewsProps> = ({ photographerId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    average: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    if (photographerId) {
      fetchReviews();
      fetchStats();
    }
  }, [photographerId]);
  
  // 获取评价列表
  const fetchReviews = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const params = {
        page: pageNum,
        limit: 5,
        isPublic: true,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };
      
      const response = await getPhotographerReviews(photographerId, params);
      
      if (pageNum === 1) {
        setReviews(response.data.items);
      } else {
        setReviews([...reviews, ...response.data.items]);
      }
      
      setPage(pageNum);
      setHasMore(response.data.items.length === 5);
    } catch (error) {
      console.error('获取评价列表失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // 获取评价统计数据
  const fetchStats = async () => {
    try {
      const response = await getReviewStats(photographerId);
      setStats(response.data);
    } catch (error) {
      console.error('获取评价统计数据失败:', error);
    }
  };
  
  // 加载更多
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchReviews(page + 1);
    }
  };
  
  // 查看评价详情
  const viewReviewDetail = (id: number) => {
    Taro.navigateTo({
      url: `/pages/user/reviews/detail?id=${id}`
    });
  };
  
  // 查看所有评价
  const viewAllReviews = () => {
    Taro.navigateTo({
      url: `/pages/photographer/reviews?id=${photographerId}`
    });
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 计算评分分布百分比
  const calculatePercentage = (count: number) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };
  
  // 预览图片
  const previewImage = (url: string, urls: string[]) => {
    Taro.previewImage({
      current: url,
      urls
    });
  };
  
  return (
    <View className="photographer-reviews">
      <View className="section-header">
        <Text className="section-title">客户评价</Text>
        {stats.total > 0 && (
          <View className="rating-summary">
            <Text className="rating-value">{stats.average.toFixed(1)}</Text>
            <AtRate value={stats.average} size={14} />
            <Text className="review-count">({stats.total}条评价)</Text>
          </View>
        )}
      </View>
      
      {stats.total > 0 ? (
        <>
          {/* 评分分布 */}
          <View className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution[rating] || 0;
              const percentage = calculatePercentage(count);
              
              return (
                <View key={rating} className="rating-bar">
                  <Text className="rating-level">{rating}星</Text>
                  <View className="progress-bar">
                    <View 
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></View>
                  </View>
                  <Text className="percentage">{percentage}%</Text>
                </View>
              );
            })}
          </View>
          
          <AtDivider />
          
          {/* 评价列表 */}
          <View className="reviews-list">
            {loading ? (
              <View className="loading-container">
                <Text>加载中...</Text>
              </View>
            ) : reviews.length === 0 ? (
              <View className="empty-container">
                <Text>暂无评价</Text>
              </View>
            ) : (
              <>
                {reviews.map(review => (
                  <View 
                    key={review.id}
                    className="review-item"
                    onClick={() => viewReviewDetail(review.id)}
                  >
                    <View className="review-header">
                      <View className="user-info">
                        <Text className="username">
                          {review.isAnonymous ? '匿名用户' : review.user?.username}
                        </Text>
                        <AtRate value={review.rating} size={14} />
                      </View>
                      <Text className="review-time">{formatDate(review.createdAt)}</Text>
                    </View>
                    
                    <View className="review-content">
                      <Text className="content-text">{review.content}</Text>
                      
                      {/* 评价图片 */}
                      {review.images && review.images.length > 0 && (
                        <View className="review-images">
                          {review.images.slice(0, 3).map((image, index) => (
                            <Image 
                              key={index}
                              className="review-image"
                              src={image.url}
                              mode="aspectFill"
                              onClick={(e) => {
                                e.stopPropagation();
                                previewImage(
                                  image.url, 
                                  review.images.map(img => img.url)
                                );
                              }}
                            />
                          ))}
                          {review.images.length > 3 && (
                            <View className="image-more">
                              <Text>+{review.images.length - 3}</Text>
                            </View>
                          )}
                        </View>
                      )}
                      
                      {/* 评价标签 */}
                      {review.tags && review.tags.length > 0 && (
                        <View className="review-tags">
                          {review.tags.slice(0, 3).map((tag, index) => (
                            <AtTag key={index} size="small" className="tag">
                              {tag}
                            </AtTag>
                          ))}
                          {review.tags.length > 3 && (
                            <Text className="more-tags">+{review.tags.length - 3}</Text>
                          )}
                        </View>
                      )}
                    </View>
                    
                    {/* 商家回复 */}
                    {review.adminReply && (
                      <View className="admin-reply">
                        <Text className="reply-label">商家回复：</Text>
                        <Text className="reply-content">{review.adminReply}</Text>
                      </View>
                    )}
                  </View>
                ))}
                
                {loadingMore && <AtLoadMore status="loading" />}
                
                {!loading && stats.total > reviews.length && (
                  <View className="view-more" onClick={viewAllReviews}>
                    查看全部{stats.total}条评价
                  </View>
                )}
              </>
            )}
          </View>
        </>
      ) : (
        <View className="empty-container">
          <Text>暂无评价</Text>
        </View>
      )}
    </View>
  );
};

export default PhotographerReviews;
