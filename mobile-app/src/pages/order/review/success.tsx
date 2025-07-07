import React from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './success.scss';

const ReviewSuccess: React.FC = () => {
  const router = useRouter();
  const { orderId, reviewId, productId } = router.params;
  
  // 跳转到商品详情
  const goToProduct = () => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    });
  };
  
  // 跳转到评价详情
  const goToReviewDetail = () => {
    Taro.navigateTo({
      url: `/pages/product/reviews/detail?id=${reviewId}`
    });
  };
  
  // 返回订单列表
  const goToOrderList = () => {
    Taro.redirectTo({
      url: '/pages/order/list/index'
    });
  };
  
  // 返回首页
  const goToHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    });
  };
  
  return (
    <View className="review-success-page">
      <View className="success-content">
        <Image 
          className="success-icon"
          src="/assets/images/review-success.png"
        />
        
        <Text className="success-title">评价提交成功</Text>
        <Text className="success-desc">感谢您的评价，我们将继续努力提供更好的服务</Text>
        
        <View className="reward-info">
          <AtIcon value="sketch" size="16" color="#ff8f1f" />
          <Text>获得10积分奖励</Text>
        </View>
        
        <View className="action-buttons">
          <Button 
            className="action-button primary"
            onClick={goToReviewDetail}
          >
            查看我的评价
          </Button>
          
          <Button 
            className="action-button share"
            openType="share"
          >
            分享评价给好友
          </Button>
          
          <Button 
            className="action-button secondary"
            onClick={goToProduct}
          >
            查看商品
          </Button>
        </View>
      </View>
      
      <View className="bottom-links">
        <Text className="link" onClick={goToOrderList}>返回订单列表</Text>
        <Text className="divider">|</Text>
        <Text className="link" onClick={goToHome}>返回首页</Text>
      </View>
    </View>
  );
};

// 设置分享信息
ReviewSuccess.onShareAppMessage = function() {
  const { reviewId } = Taro.getCurrentInstance().router.params;
  return {
    title: '我刚刚发表了一条评价，快来看看吧！',
    path: `/pages/product/reviews/detail?id=${reviewId}`,
    imageUrl: '/assets/images/share-review.png'
  };
};

export default ReviewSuccess;
