import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtIcon, AtLoadMore } from 'taro-ui';
import { getProductReviews } from '../../../services/review';
import { getProductDetail } from '../../../services/product';
import RatingTags from '../../../components/RatingTags';
import './index.scss';

const ProductReviews: React.FC = () => {
  const router = useRouter();
  const { productId } = router.params;
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalCount: 0,
    averageRating: 0,
    satisfactionRate: 0,
    ratingDistribution: {},
    distribution: {
      good: 0,
      neutral: 0,
      bad: 0,
      withImages: 0
    }
  });
  
  // 获取商品信息和评价
  useEffect(() => {
    if (!productId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // 获取商品信息
        const productRes = await getProductDetail(Number(productId));
        setProduct(productRes.data);
        
        // 获取评价列表
        await fetchReviews(1);
      } catch (error) {
        console.error('获取数据失败:', error);
        Taro.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);
  
  // 获取评价列表
  const fetchReviews = async (pageNum: number = 1, filterType: string = filter) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const res = await getProductReviews(Number(productId), {
        page: pageNum,
        limit: 10,
        filter: filterType,
        withStats: pageNum === 1 // 只在第一页请求时获取统计信息
      });
      
      if (pageNum === 1) {
        setReviews(res.data.reviews || []);
        
        if (res.data.stats) {
          // 整理评分分布数据
          const ratingDist = res.data.stats.ratingDistribution || {};
          const distribution = {
            good: (ratingDist[5] || 0) + (ratingDist[4] || 0),
            neutral: ratingDist[3] || 0,
            bad: (ratingDist[2] || 0) + (ratingDist[1] || 0),
            withImages: res.data.stats.withImageReviews || 0
          };
          
          setStats({
            ...res.data.stats,
            distribution
          });
        }
      } else {
        setReviews(prev => [...prev, ...(res.data.reviews || [])]);
      }
      
      setHasMore((res.data.reviews || []).length === 10);
      setPage(pageNum);
      setFilter(filterType);
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
      fetchReviews(page + 1);
    }
  };
  
  // 处理筛选变化
  const handleFilterChange = (value: string) => {
    fetchReviews(1, value);
  };
  
  // 返回商品详情
  const goBack = () => {
    Taro.navigateBack();
  };
  
  // 查看评价详情
  const viewReviewDetail = (reviewId: number) => {
    Taro.navigateTo({
      url: `/pages/product/reviews/detail?id=${reviewId}`
    });
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 预览图片
  const previewImages = (images: string[], current: string) => {
    Taro.previewImage({
      current,
      urls: images
    });
  };
  
  if (loading && page === 1) {
    return (
      <View className="reviews-loading">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className="product-reviews-page">
      {/* 页面头部 */}
      <View className="page-header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="header-title">用户评价</Text>
      </View>
      
      {/* 评价统计信息 */}
      <View className="reviews-stats">
        <View className="stats-summary">
          <View className="rating-item">
            <Text className="rating-value">{stats.averageRating.toFixed(1)}</Text>
            <Text className="rating-label">综合评分</Text>
          </View>
          <View className="divider"></View>
          <View className="rating-item">
            <Text className="rating-value">{stats.satisfactionRate}%</Text>
            <Text className="rating-label">满意度</Text>
          </View>
          <View className="divider"></View>
          <View className="rating-item">
            <Text className="rating-value">{stats.totalCount}</Text>
            <Text className="rating-label">评价数</Text>
          </View>
        </View>
        
        {/* 评分筛选标签 */}
        <RatingTags
          distribution={stats.distribution}
          totalCount={stats.totalCount}
          onChange={handleFilterChange}
          value={filter}
        />
      </View>
      
      {/* 评价列表 */}
      {reviews.length === 0 ? (
        <View className="empty-reviews">
          <View className="empty-icon">
            <AtIcon value="message" size="48" color="#ddd" />
          </View>
          <Text className="empty-text">暂无相关评价</Text>
        </View>
      ) : (
        <ScrollView
          scrollY
          className="reviews-list"
          onScrollToLower={loadMore}
        >
          {reviews.map(review => (
            <View
              key={review.id}
              className="review-item"
              onClick={() => viewReviewDetail(review.id)}
            >
              {/* 用户信息 */}
              <View className="review-header">
                <Image
                  className="user-avatar"
                  src={review.user?.avatar || '/assets/images/default-avatar.png'}
                />
                <View className="user-info">
                  <Text className="user-name">{review.isAnonymous ? '匿名用户' : review.user?.username}</Text>
                  <View className="rating-row">
                    <View className="stars">
                      {Array(5).fill(0).map((_, i) => (
                        <View key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                          ★
                        </View>
                      ))}
                    </View>
                    <Text className="review-date">{formatDate(review.createdAt)}</Text>
                  </View>
                </View>
              </View>
              
              {/* 评价内容 */}
              <View className="review-content">
                <Text className="review-text">{review.content}</Text>
                
                {/* 评价标签 */}
                {review.tags && review.tags.length > 0 && (
                  <View className="review-tags">
                    {review.tags.map((tag, index) => (
                      <Text key={index} className="tag-item">{tag}</Text>
                    ))}
                  </View>
                )}
                
                {/* 评价图片 */}
                {review.images && review.images.length > 0 && (
                  <View className="review-images">
                    {review.images.map((image, index) => (
                      <Image
                        key={index}
                        className="review-image"
                        src={image.url}
                        mode="aspectFill"
                        onClick={(e) => {
                          e.stopPropagation();
                          previewImages(
                            review.images.map(img => img.url),
                            image.url
                          );
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>
              
              {/* 商家回复 */}
              {review.reply && (
                <View className="merchant-reply">
                  <Text className="reply-label">商家回复：</Text>
                  <Text className="reply-content">{review.reply}</Text>
                </View>
              )}
            </View>
          ))}
          
          {/* 加载更多 */}
          {loadingMore && (
            <AtLoadMore status="loading" />
          )}
          
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

export default ProductReviews;
