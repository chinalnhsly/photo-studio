import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtIcon, AtRate, AtTag, AtLoadMore } from 'taro-ui';
import { getPhotographerReviews } from '../../services/review';
import './reviews.scss';

const PhotographerReviewsList: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;

  const [reviews, setReviews] = useState<any[]>([]);
  const [photographerName, setPhotographerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    if (!id) {
      Taro.showToast({
        title: '缺少摄影师ID',
        icon: 'none'
      });
      return;
    }
    
    fetchReviews();
  }, [id]);
  
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
        limit: 10,
        isPublic: true,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };
      
      const response = await getPhotographerReviews(Number(id), params);
      
      if (pageNum === 1) {
        setReviews(response.data.items);
        // 从第一条评价获取摄影师名称
        if (response.data.items.length > 0) {
          setPhotographerName(response.data.items[0].photographer?.name || '摄影师');
        }
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
  
  // 加载更多
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchReviews(page + 1);
    }
  };
  
  // 查看评价详情
  const viewReviewDetail = (reviewId: number) => {
    Taro.navigateTo({
      url: `/pages/user/reviews/detail?id=${reviewId}`
    });
  };
  
  // 返回上一页
  const goBack = () => {
    Taro.navigateBack();
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 预览图片
  const previewImage = (url: string, urls: string[], e: any) => {
    e.stopPropagation();
    Taro.previewImage({
      current: url,
      urls
    });
  };
  
  return (
    <View className="photographer-reviews-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">{photographerName}的评价</Text>
      </View>
      
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
                          onClick={(e) => previewImage(
                            image.url, 
                            review.images.map(img => img.url),
                            e
                          )}
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
                      {review.tags.map((tag, index) => (
                        <AtTag key={index} size="small" className="tag">
                          {tag}
                        </AtTag>
                      ))}
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
          </View>
          
          {loadingMore && <AtLoadMore status="loading" />}
          
          {!hasMore && reviews.length > 0 && (
            <View className="no-more">
              <Text>没有更多评价了</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PhotographerReviewsList;
