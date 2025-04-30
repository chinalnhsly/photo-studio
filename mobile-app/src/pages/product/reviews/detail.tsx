import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtRate, AtIcon, AtTag, AtDivider } from 'taro-ui';
import { getReviewDetail, likeReview } from '../../../services/review';
import { formatDate } from '../../../utils/format';
import './detail.scss';

const ReviewDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  // 获取评价详情
  useEffect(() => {
    if (!id) return;
    
    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        const response = await getReviewDetail(Number(id));
        setReview(response.data);
        setLikeCount(response.data.likesCount || 0);
        
        // 检查本地存储，确定是否已点赞
        const likedReviews = Taro.getStorageSync('likedReviews') || [];
        setLiked(likedReviews.includes(Number(id)));
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
    
    fetchReviewDetail();
  }, [id]);
  
  // 点赞评价
  const handleLike = async () => {
    if (liked) return;
    
    try {
      await likeReview(Number(id));
      
      // 更新点赞状态
      setLiked(true);
      setLikeCount(prev => prev + 1);
      
      // 存储已点赞的评价ID
      const likedReviews = Taro.getStorageSync('likedReviews') || [];
      likedReviews.push(Number(id));
      Taro.setStorageSync('likedReviews', likedReviews);
      
      Taro.showToast({
        title: '点赞成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('点赞失败:', error);
      Taro.showToast({
        title: '点赞失败',
        icon: 'none'
      });
    }
  };
  
  // 预览图片
  const previewImage = (current: string, urls: string[]) => {
    Taro.previewImage({
      current,
      urls
    });
  };
  
  // 返回上一页
  const handleGoBack = () => {
    Taro.navigateBack();
  };
  
  if (loading) {
    return (
      <View className="review-detail-loading">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!review) {
    return (
      <View className="review-detail-error">
        <Text>评价不存在或已删除</Text>
        <Button onClick={handleGoBack} className="back-button">返回</Button>
      </View>
    );
  }
  
  return (
    <View className="review-detail-page">
      {/* 顶部导航 */}
      <View className="page-header">
        <View className="back-icon" onClick={handleGoBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="header-title">评价详情</Text>
      </View>
      
      {/* 用户信息 */}
      <View className="user-section">
        <Image 
          className="user-avatar" 
          src={review.user?.avatar || '/assets/images/default-avatar.png'} 
        />
        <View className="user-info">
          <Text className="user-name">{review.isAnonymous ? '匿名用户' : review.user?.username}</Text>
          <Text className="review-time">{formatDate(review.createdAt)}</Text>
        </View>
      </View>
      
      {/* 评价内容 */}
      <View className="content-section">
        {/* 评分 */}
        <View className="rating-row">
          <AtRate value={review.rating} size={16} />
          <Text className="rating-text">
            {review.rating === 5 ? '非常满意' : 
             review.rating === 4 ? '满意' :
             review.rating === 3 ? '一般' :
             review.rating === 2 ? '不满意' : '非常不满意'}
          </Text>
        </View>
        
        {/* 评价文字 */}
        <Text className="review-content">{review.content}</Text>
        
        {/* 评价标签 */}
        {review.tags && review.tags.length > 0 && (
          <View className="tags-container">
            {review.tags.map((tag, index) => (
              <AtTag key={index} size="small" className="tag-item">{tag}</AtTag>
            ))}
          </View>
        )}
        
        {/* 评价图片 */}
        {review.images && review.images.length > 0 && (
          <View className="images-container">
            {review.images.map((image, index) => (
              <Image 
                key={index}
                src={image.url} 
                className="review-image"
                mode="aspectFill"
                onClick={() => previewImage(
                  image.url, 
                  review.images.map(img => img.url)
                )}
              />
            ))}
          </View>
        )}
      </View>
      
      {/* 商家回复 */}
      {review.reply && (
        <View className="reply-section">
          <View className="reply-header">
            <AtIcon value="message" size="16" color="#333" />
            <Text className="reply-title">商家回复</Text>
          </View>
          <Text className="reply-content">{review.reply}</Text>
          <Text className="reply-time">{formatDate(review.replyTime)}</Text>
        </View>
      )}
      
      <AtDivider />
      
      {/* 商品信息 */}
      <View className="product-section">
        <Image 
          className="product-image"
          src={review.product?.image} 
          mode="aspectFill"
        />
        <View className="product-info">
          <Text className="product-name">{review.product?.name}</Text>
          <Text className="product-price">¥{review.product?.price?.toFixed(2)}</Text>
        </View>
        <Button 
          className="view-product-btn"
          onClick={() => Taro.navigateTo({ url: `/pages/product/detail/index?id=${review.product.id}` })}
        >
          查看商品
        </Button>
      </View>
      
      {/* 底部操作 */}
      <View className="action-section">
        <View className={`like-button ${liked ? 'active' : ''}`} onClick={handleLike}>
          <AtIcon value={liked ? 'heart-2' : 'heart'} size="20" color={liked ? '#ff4d4f' : '#999'} />
          <Text>{likeCount > 0 ? likeCount : '点赞'}</Text>
        </View>
        
        <Button 
          className="share-button"
          openType="share"
        >
          分享
        </Button>
      </View>
    </View>
  );
};

// 分享配置
ReviewDetail.onShareAppMessage = function(res) {
  const { id } = Taro.getCurrentInstance().router.params;
  return {
    title: '看看这条评价，说得太对了！',
    path: `/pages/product/reviews/detail?id=${id}`
  };
};

export default ReviewDetail;
