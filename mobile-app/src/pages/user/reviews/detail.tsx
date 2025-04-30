import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon, AtRate, AtTag, AtDivider } from 'taro-ui';
import { getReviewDetail } from '../../../services/review';
import './detail.scss';

const ReviewDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      Taro.showToast({
        title: '缺少评价ID',
        icon: 'none'
      });
      return;
    }
    
    fetchReviewDetail();
  }, [id]);
  
  // 获取评价详情
  const fetchReviewDetail = async () => {
    try {
      setLoading(true);
      const response = await getReviewDetail(Number(id));
      setReview(response.data);
    } catch (error) {
      console.error('获取评价详情失败:', error);
      Taro.showToast({
        title: '获取评价详情失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
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
  
  // 图片预览
  const previewImage = (url: string, urls: string[]) => {
    Taro.previewImage({
      current: url,
      urls
    });
  };
  
  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!review) {
    return (
      <View className="error-container">
        <Text>评价不存在或已删除</Text>
        <Button className="back-button" onClick={goBack}>返回</Button>
      </View>
    );
  }
  
  return (
    <View className="review-detail-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">评价详情</Text>
      </View>
      
      {/* 评价内容卡片 */}
      <View className="review-card">
        {/* 评价头部 */}
        <View className="review-header">
          <View className="user-info">
            <Text className="username">
              {review.isAnonymous ? '匿名用户' : review.user?.username}
            </Text>
            <Text className="review-time">{formatDate(review.createdAt)}</Text>
          </View>
          
          <View className="rating-row">
            <AtRate value={review.rating} size={18} />
            {review.isRecommended && (
              <AtTag size="small" type="primary" className="recommended-tag">
                推荐
              </AtTag>
            )}
          </View>
        </View>
        
        {/* 评价内容 */}
        <View className="review-content">
          <Text className="content-text">{review.content}</Text>
          
          {/* 评价图片 */}
          {review.images && review.images.length > 0 && (
            <View className="review-images">
              {review.images.map((image, index) => (
                <Image 
                  key={index}
                  className="review-image"
                  src={image.url}
                  mode="aspectFill"
                  onClick={() => previewImage(
                    image.url, 
                    review.images.map(img => img.url)
                  )}
                />
              ))}
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
            <Text className="reply-time">
              {formatDate(review.adminReplyTime)}
            </Text>
          </View>
        )}
      </View>
      
      {/* 摄影师信息 */}
      <View className="photographer-card">
        <View className="card-title">
          <Text>评价对象</Text>
        </View>
        
        <View className="photographer-info">
          <Image 
            className="photographer-avatar"
            src={review.photographer?.avatar}
            mode="aspectFill"
          />
          <View className="photographer-details">
            <Text className="photographer-name">
              {review.photographer?.name}
            </Text>
            <View className="photographer-rating">
              <AtRate value={review.photographer?.rating} size={14} />
              <Text className="rating-value">
                {review.photographer?.rating?.toFixed(1)}
              </Text>
            </View>
          </View>
          
          <Button 
            className="view-button"
            onClick={() => Taro.navigateTo({
              url: `/pages/photographer/detail?id=${review.photographer?.id}`
            })}
          >
            查看
          </Button>
        </View>
      </View>
      
      {/* 预约信息 */}
      <View className="booking-card">
        <View className="card-title">
          <Text>预约信息</Text>
        </View>
        
        <View className="booking-info">
          <View className="info-item">
            <Text className="info-label">预约编号</Text>
            <Text className="info-value">{review.booking?.bookingNumber}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">预约项目</Text>
            <Text className="info-value">{review.booking?.product?.name}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">预约日期</Text>
            <Text className="info-value">
              {formatDate(review.booking?.bookingDate)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReviewDetail;
