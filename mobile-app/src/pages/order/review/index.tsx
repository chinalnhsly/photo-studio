import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Textarea, Button } from '@tarojs/components';
import { AtRate, AtTag, AtIcon, AtSwitch, AtToast } from 'taro-ui';
import { getOrderDetail } from '../../../services/order';
import { submitReview, uploadReviewImage } from '../../../services/review';
import ImageUploader from '../../../components/ImageUploader';
import './index.scss';

// 预设评价标签
const PRESET_TAGS = [
  '拍摄技术好',
  '服务很贴心',
  '效果很满意',
  '摄影师专业',
  '化妆师技术佳',
  '场景多样',
  '服装漂亮',
  '价格合理',
  '出片速度快',
  '交通便利'
];

const OrderReviewPage: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.params;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isOpened: false, text: '', status: '' });
  
  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const res = await getOrderDetail(orderId);
        setOrder(res.data);
      } catch (error) {
        console.error('获取订单详情失败:', error);
        showToast('获取订单详情失败', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetail();
  }, [orderId]);
  
  // 显示提示信息
  const showToast = (text: string, status: 'success' | 'error' | 'loading' = 'success') => {
    setToastConfig({
      isOpened: true,
      text,
      status
    });
    
    setTimeout(() => {
      setToastConfig({ ...toastConfig, isOpened: false });
    }, 2000);
  };
  
  // 处理标签选择
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        showToast('最多选择5个标签', 'error');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // 处理图片上传
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };
  
  // 提交评价
  const handleSubmitReview = async () => {
    if (content.trim().length < 5) {
      showToast('评价内容至少5个字', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 上传图片，获取URL
      const uploadedImages = [];
      
      if (images.length > 0) {
        for (const image of images) {
          // 检查是否已经是URL (可能是已上传过的图片)
          if (image.startsWith('http')) {
            uploadedImages.push(image);
            continue;
          }
          
          // 上传图片
          const uploadResult = await uploadReviewImage(image);
          const result = JSON.parse(uploadResult.data);
          
          if (result.code === 200 && result.data?.url) {
            uploadedImages.push(result.data.url);
          }
        }
      }
      
      // 提交评价
      const response = await submitReview({
        orderId,
        productId: order.items[0].productId,
        rating,
        content: content.trim(),
        tags: selectedTags,
        images: uploadedImages,
        anonymous
      });
      
      const reviewId = response.data?.id;
      
      // 跳转到成功页面
      Taro.redirectTo({
        url: `/pages/order/review/success?orderId=${orderId}&reviewId=${reviewId}&productId=${order.items[0].productId}`
      });
    } catch (error) {
      console.error('提交评价失败:', error);
      showToast('提交评价失败，请重试', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 返回订单详情
  const goBack = () => {
    Taro.navigateBack();
  };
  
  if (loading) {
    return (
      <View className="order-review-loading">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!order) {
    return (
      <View className="order-review-error">
        <Text>订单不存在或已删除</Text>
        <Button className="back-button" onClick={goBack}>返回</Button>
      </View>
    );
  }
  
  return (
    <View className="order-review-page">
      {/* 商品信息卡片 */}
      <View className="product-card">
        <Image 
          className="product-image"
          src={order.items[0].image}
          mode="aspectFill"
        />
        <View className="product-info">
          <Text className="product-name">{order.items[0].name}</Text>
          <Text className="product-price">¥{order.items[0].price.toFixed(2)}</Text>
        </View>
      </View>
      
      {/* 评分 */}
      <View className="rating-section">
        <Text className="section-title">服务评分</Text>
        <View className="rating-wrapper">
          <AtRate
            value={rating}
            onChange={value => setRating(value)}
            size={30}
          />
          <Text className="rating-text">
            {rating === 5 ? '非常满意' : 
             rating === 4 ? '满意' :
             rating === 3 ? '一般' :
             rating === 2 ? '不满意' : '非常不满意'}
          </Text>
        </View>
      </View>
      
      {/* 评价内容 */}
      <View className="content-section">
        <Text className="section-title">评价内容</Text>
        <Textarea
          className="review-textarea"
          value={content}
          onInput={e => setContent(e.detail.value)}
          placeholder="请分享您的体验，例如服务质量、拍摄环境等，至少5个字"
          maxlength={500}
        />
        <Text className="char-count">{content.length}/500</Text>
      </View>
      
      {/* 评价标签 */}
      <View className="tags-section">
        <Text className="section-title">评价标签</Text>
        <View className="tags-wrapper">
          {PRESET_TAGS.map(tag => (
            <AtTag
              key={tag}
              name={tag}
              type="primary"
              circle
              active={selectedTags.includes(tag)}
              onClick={() => handleTagClick(tag)}
              className={selectedTags.includes(tag) ? 'tag-active' : 'tag-normal'}
            >
              {tag}
            </AtTag>
          ))}
        </View>
        <Text className="tag-hint">最多选择5个标签 ({selectedTags.length}/5)</Text>
      </View>
      
      {/* 上传图片 */}
      <View className="upload-section">
        <Text className="section-title">上传图片</Text>
        <ImageUploader
          files={images}
          onChange={handleImagesChange}
          maxCount={9}
        />
        <Text className="upload-hint">最多上传9张图片，建议上传拍摄成品照</Text>
      </View>
      
      {/* 匿名设置 */}
      <View className="anonymous-section">
        <Text className="anonymous-text">匿名评价</Text>
        <AtSwitch
          checked={anonymous}
          onChange={value => setAnonymous(value)}
          color="#1890ff"
        />
        <Text className="anonymous-hint">开启后，评价中将不会显示您的头像和昵称</Text>
      </View>
      
      {/* 底部按钮 */}
      <View className="bottom-buttons">
        <Button 
          className="cancel-button" 
          onClick={goBack}
        >
          取消
        </Button>
        <Button 
          className="submit-button" 
          onClick={handleSubmitReview}
          loading={submitting}
        >
          发布评价
        </Button>
      </View>
      
      {/* 提示消息 */}
      <AtToast
        isOpened={toastConfig.isOpened}
        text={toastConfig.text}
        status={toastConfig.status}
        hasMask
      />
    </View>
  );
};

export default OrderReviewPage;
