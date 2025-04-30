import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button, Textarea, Switch } from '@tarojs/components';
import { AtIcon, AtRate, AtTag, AtToast } from 'taro-ui';
import { getBookingDetail } from '../../services/booking';
import { createReview } from '../../services/review';
import './review.scss';

// 常用评价标签
const REVIEW_TAGS = [
  '服务专业', '摄影技术好', '很有耐心', '拍摄效果好',
  '服务态度好', '环境舒适', '造型美观', '按时完成',
  '沟通顺畅', '性价比高'
];

const SubmitReview: React.FC = () => {
  const router = useRouter();
  const { bookingId } = router.params;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isOpened: false, text: '', status: '' });
  
  // 评价表单数据
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecommended, setIsRecommended] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  useEffect(() => {
    if (!bookingId) {
      Taro.showToast({
        title: '缺少预约信息',
        icon: 'none'
      });
      return;
    }
    
    fetchBookingDetail();
  }, [bookingId]);
  
  // 获取预约详情
  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await getBookingDetail(Number(bookingId));
      setBooking(response.data);
      
      // 如果预约未完成，不允许评价
      if (response.data.status !== 'completed') {
        Taro.showModal({
          title: '无法评价',
          content: '只有已完成的订单才能进行评价',
          showCancel: false,
          success: () => {
            Taro.navigateBack();
          }
        });
      }
    } catch (error) {
      console.error('获取预约详情失败:', error);
      showToast('获取预约详情失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 显示提示
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
  
  // 处理评分变化
  const handleRatingChange = (value: number) => {
    setRating(value);
    // 根据评分自动设置是否推荐
    setIsRecommended(value >= 4);
  };
  
  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        showToast('最多选择5个标签', 'error');
      }
    }
  };
  
  // 上传图片
  const handleUploadImage = () => {
    if (uploadedImages.length >= 9) {
      showToast('最多上传9张图片', 'error');
      return;
    }
    
    Taro.chooseImage({
      count: 9 - uploadedImages.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 这里应该有实际的图片上传逻辑，这里简化为直接使用本地路径
        const tempFilePaths = res.tempFilePaths;
        uploadImageFiles(tempFilePaths);
      }
    });
  };
  
  // 上传图片文件
  const uploadImageFiles = async (filePaths: string[]) => {
    try {
      showToast('上传中...', 'loading');
      
      // 这里应该是实际的上传逻辑，比如调用后端API上传图片
      // 为了简化，这里直接使用本地路径模拟上传成功
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadedImages([...uploadedImages, ...filePaths]);
      showToast('上传成功', 'success');
    } catch (error) {
      console.error('上传图片失败:', error);
      showToast('上传图片失败', 'error');
    }
  };
  
  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };
  
  // 预览图片
  const handlePreviewImage = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: uploadedImages
    });
  };
  
  // 提交评价
  const handleSubmitReview = async () => {
    if (content.trim().length < 5) {
      showToast('评价内容不能少于5个字', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const reviewData = {
        bookingId: Number(bookingId),
        photographerId: booking.photographerId,
        rating,
        content,
        isAnonymous,
        isRecommended,
        tags: selectedTags,
        imageUrls: uploadedImages
      };
      
      await createReview(reviewData);
      
      Taro.showModal({
        title: '评价成功',
        content: '感谢您的评价，我们会继续提升服务质量',
        showCancel: false,
        success: () => {
          // 跳转回我的预约列表
          Taro.redirectTo({
            url: '/pages/user/bookings/index'
          });
        }
      });
    } catch (error) {
      console.error('提交评价失败:', error);
      showToast('提交评价失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!booking) {
    return (
      <View className="error-container">
        <Text>预约不存在或已删除</Text>
        <Button className="back-button" onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    );
  }
  
  return (
    <View className="review-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={() => Taro.navigateBack()}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">发表评价</Text>
      </View>
      
      {/* 预约信息 */}
      <View className="booking-info-card">
        <View className="info-header">
          <Text className="photographer-name">{booking.photographer?.name}</Text>
          <Text className="booking-number">预约号: {booking.bookingNumber}</Text>
        </View>
        <View className="info-content">
          <View className="info-item">
            <Text className="info-label">拍摄日期</Text>
            <Text className="info-value">{formatDate(booking.bookingDate)}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">拍摄内容</Text>
            <Text className="info-value">{booking.product?.name}</Text>
          </View>
        </View>
      </View>
      
      {/* 评价表单 */}
      <View className="review-form">
        {/* 评分 */}
        <View className="form-item rating-section">
          <Text className="form-label">服务评分</Text>
          <View className="rating-row">
            <AtRate
              value={rating}
              onChange={handleRatingChange}
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
        <View className="form-item">
          <Textarea
            value={content}
            onInput={e => setContent(e.detail.value)}
            placeholder="请输入您的评价内容，分享您的拍摄体验..."
            className="review-textarea"
            maxlength={500}
          />
          <Text className="word-count">{content.length}/500</Text>
        </View>
        
        {/* 上传图片 */}
        <View className="form-item">
          <Text className="form-label">上传照片</Text>
          <View className="upload-section">
            {uploadedImages.map((img, index) => (
              <View key={index} className="image-item">
                <Image
                  src={img}
                  className="preview-image"
                  onClick={() => handlePreviewImage(img)}
                  mode="aspectFill"
                />
                <View 
                  className="delete-icon" 
                  onClick={() => handleRemoveImage(index)}
                >
                  <AtIcon value="close" size="16" color="#fff" />
                </View>
              </View>
            ))}
            
            {uploadedImages.length < 9 && (
              <View className="upload-button" onClick={handleUploadImage}>
                <AtIcon value="camera" size="24" color="#999" />
                <Text className="upload-text">上传图片</Text>
              </View>
            )}
          </View>
          <Text className="upload-tip">最多可上传9张图片</Text>
        </View>
        
        {/* 评价标签 */}
        <View className="form-item">
          <Text className="form-label">评价标签 (最多选择5个)</Text>
          <View className="tags-container">
            {REVIEW_TAGS.map(tag => (
              <AtTag
                key={tag}
                className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
                active={selectedTags.includes(tag)}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </AtTag>
            ))}
          </View>
        </View>
        
        {/* 附加选项 */}
        <View className="form-item options-section">
          <View className="option-row">
            <Text className="option-label">匿名评价</Text>
            <Switch 
              checked={isAnonymous} 
              onChange={e => setIsAnonymous(e.detail.value)} 
              color="#1890ff"
            />
          </View>
          <View className="option-row">
            <Text className="option-label">推荐给其他客户</Text>
            <Switch 
              checked={isRecommended} 
              onChange={e => setIsRecommended(e.detail.value)} 
              color="#1890ff"
            />
          </View>
        </View>
      </View>
      
      {/* 提交按钮 */}
      <View className="submit-section">
        <Button 
          className="submit-button" 
          onClick={handleSubmitReview}
          loading={submitting}
          disabled={submitting}
        >
          提交评价
        </Button>
      </View>
      
      <AtToast
        isOpened={toastConfig.isOpened}
        text={toastConfig.text}
        status={toastConfig.status as any}
      />
    </View>
  );
};

export default SubmitReview;
