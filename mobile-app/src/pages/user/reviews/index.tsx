import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtLoadMore, AtRate, AtTag, AtIcon } from 'taro-ui';
import { getUserReviews } from '../../../services/review';
import './index.scss';

const MyReviews: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchReviews();
  }, [current]);
  
  // 获取评价列表
  const fetchReviews = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // 根据当前选项卡确定过滤条件
      const params: any = {
        page: pageNum,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };
      
      if (current === 1) {
        // 仅显示推荐评价
        params.isRecommended = true;
      }
      
      const response = await getUserReviews(params);
      
      if (pageNum === 1) {
        setReviews(response.data.items);
      } else {
        setReviews([...reviews, ...response.data.items]);
      }
      
      setPage(pageNum);
      setHasMore(response.data.items.length === 10);
    } catch (error) {
      console.error('获取评价列表失败:', error);
      Taro.showToast({
        title: '获取评价列表失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // 处理Tab切换
  const handleTabClick = (index: number) => {
    setCurrent(index);
    setPage(1);
    setHasMore(true);
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
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  return (
    <View className="my-reviews-page">
      <AtTabs
        current={current}
        tabList={[
          { title: '全部评价' },
          { title: '推荐评价' }
        ]}
        onClick={handleTabClick}
        swipeable={false}
      >
        {Array(2).fill(0).map((_, index) => (
          <AtTabsPane key={index} current={current} index={index}>
            {loading ? (
              <View className="loading-container">
                <Text>加载中...</Text>
              </View>
            ) : reviews.length === 0 ? (
              <View className="empty-container">
                <Image 
                  className="empty-icon"
                  src="/assets/images/empty-reviews.png"
                />
                <Text className="empty-text">暂无评价记录</Text>
              </View>
            ) : (
              <ScrollView
                scrollY
                className="reviews-scroll"
                onScrollToLower={loadMore}
              >
                <View className="reviews-list">
                  {reviews.map(review => (
                    <View 
                      key={review.id}
                      className="review-item"
                      onClick={() => viewReviewDetail(review.id)}
                    >
                      <View className="review-header">
                        <View className="booking-info">
                          <View className="booking-info-row">
                            <Text className="photographer-name">{review.photographer?.name}</Text>
                            <Text className="booking-date">{formatDate(review.createdAt)}</Text>
                          </View>
                          <View className="rating-row">
                            <AtRate value={review.rating} size={16} />
                            {review.isRecommended && (
                              <AtTag size="small" type="primary" className="recommended-tag">
                                推荐
                              </AtTag>
                            )}
                          </View>
                        </View>
                      </View>
                      
                      <View className="review-content">
                        <Text className="content-text">{review.content}</Text>
                        
                        {review.images && review.images.length > 0 && (
                          <View className="review-images">
                            {review.images.slice(0, 3).map((image, imgIndex) => (
                              <Image 
                                key={imgIndex}
                                className="review-image"
                                src={image.url}
                                mode="aspectFill"
                              />
                            ))}
                            {review.images.length > 3 && (
                              <View className="image-more">
                                <Text>+{review.images.length - 3}</Text>
                              </View>
                            )}
                          </View>
                        )}
                        
                        {review.tags && review.tags.length > 0 && (
                          <View className="review-tags">
                            {review.tags.map((tag, tagIndex) => (
                              <AtTag key={tagIndex} size="small" className="tag">
                                {tag}
                              </AtTag>
                            ))}
                          </View>
                        )}
                      </View>
                      
                      {review.adminReply && (
                        <View className="admin-reply">
                          <Text className="reply-label">商家回复：</Text>
                          <Text className="reply-content">{review.adminReply}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                
                {loadingMore && <AtLoadMore status="loading" />}
                
                {!hasMore && reviews.length > 0 && (
                  <View className="no-more">
                    <Text>没有更多评价了</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
};

export default MyReviews;
