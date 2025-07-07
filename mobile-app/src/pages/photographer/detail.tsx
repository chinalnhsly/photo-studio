import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Swiper, SwiperItem, Button } from '@tarojs/components';
import { AtIcon, AtTabs, AtTabsPane, AtFloatLayout, AtTag, AtRate } from 'taro-ui';
import { getPhotographerDetail, getPhotographerAvailability } from '../../services/photographer';
import './detail.scss';

const PhotographerDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [photographer, setPhotographer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // 加载摄影师详情
  useEffect(() => {
    if (!id) return;
    
    fetchPhotographerDetail();
  }, [id]);
  
  // 获取摄影师详情
  const fetchPhotographerDetail = async () => {
    try {
      setLoading(true);
      const response = await getPhotographerDetail(Number(id));
      setPhotographer(response.data);
      
      // 获取可用时间段
      fetchAvailability();
    } catch (error) {
      console.error('获取摄影师详情失败:', error);
      Taro.showToast({
        title: '获取摄影师详情失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 获取摄影师可用时间
  const fetchAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30); // 获取未来30天的可用日期
      
      const response = await getPhotographerAvailability(
        Number(id),
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      // 按日期分组处理可用时间段
      const availabilityByDate = {};
      
      response.data.forEach(slot => {
        const date = slot.date.split('T')[0];
        
        if (!availabilityByDate[date]) {
          availabilityByDate[date] = [];
        }
        
        availabilityByDate[date].push(slot);
      });
      
      // 转换为数组
      const datesArray = Object.keys(availabilityByDate).map(date => ({
        date,
        slots: availabilityByDate[date]
      }));
      
      setAvailableDates(datesArray);
    } catch (error) {
      console.error('获取可用时间失败:', error);
    } finally {
      setAvailabilityLoading(false);
    }
  };
  
  // 处理Tab切换
  const handleTabClick = (index: number) => {
    setCurrentTab(index);
  };
  
  // 返回上一页
  const goBack = () => {
    Taro.navigateBack();
  };
  
  // 查看作品图片
  const viewPortfolio = (image: string) => {
    setSelectedImage(image);
    setPreviewVisible(true);
  };
  
  // 关闭图片预览
  const closePreview = () => {
    setPreviewVisible(false);
  };
  
  // 跳转到预约页面
  const goToBooking = () => {
    Taro.navigateTo({
      url: `/pages/booking/photographer?id=${id}`
    });
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    return {
      month,
      day,
      weekday,
      full: `${month}月${day}日 ${weekday}`
    };
  };
  
  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!photographer) {
    return (
      <View className="error-container">
        <Text>未找到摄影师信息</Text>
        <Button className="back-button" onClick={goBack}>返回</Button>
      </View>
    );
  }
  
  return (
    <View className="photographer-detail-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#fff" />
        </View>
        <Text className="header-title">摄影师详情</Text>
      </View>
      
      {/* 摄影师基本信息 */}
      <View className="photographer-banner">
        <Image className="photographer-cover" src={photographer.avatar} mode="aspectFill" />
        <View className="banner-content">
          <View className="photographer-avatar-container">
            <Image className="photographer-avatar" src={photographer.avatar} mode="aspectFill" />
          </View>
          <View className="basic-info">
            <Text className="photographer-name">{photographer.name}</Text>
            <View className="rating-row">
              <AtRate value={photographer.rating} size={12} />
              <Text className="rating-value">{photographer.rating.toFixed(1)}</Text>
              <Text className="booking-count">已预约 {photographer.totalBookings} 次</Text>
            </View>
            <View className="specialties">
              {photographer.specialties?.map((specialty, index) => (
                <AtTag key={index} size="small" className="specialty-tag">
                  {specialty.name}
                </AtTag>
              ))}
            </View>
          </View>
        </View>
      </View>
      
      {/* 内容标签页 */}
      <AtTabs 
        current={currentTab} 
        tabList={[
          { title: '个人介绍' },
          { title: '作品集' },
          { title: '可预约时间' }
        ]}
        onClick={handleTabClick}
      >
        {/* 个人介绍标签页 */}
        <AtTabsPane current={currentTab} index={0}>
          <ScrollView scrollY className="tab-content">
            <View className="section">
              <View className="section-header">
                <Text className="section-title">个人介绍</Text>
              </View>
              <Text className="biography">{photographer.biography}</Text>
            </View>
            
            <View className="section">
              <View className="section-header">
                <Text className="section-title">技能特长</Text>
              </View>
              <View className="specialties-grid">
                {photographer.specialties?.map((specialty, index) => (
                  <View key={index} className="specialty-item">
                    <View className="specialty-icon">
                      {specialty.icon ? (
                        <Image src={specialty.icon} className="icon-image" />
                      ) : (
                        <AtIcon value="camera" size="20" color="#1890ff" />
                      )}
                    </View>
                    <Text className="specialty-name">{specialty.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View className="section">
              <View className="section-header">
                <Text className="section-title">个人信息</Text>
              </View>
              <View className="info-list">
                <View className="info-item">
                  <Text className="info-label">从业年限</Text>
                  <Text className="info-value">{photographer.yearsOfExperience} 年</Text>
                </View>
                <View className="info-item">
                  <Text className="info-label">语言能力</Text>
                  <Text className="info-value">{photographer.languagesSpoken || '普通话'}</Text>
                </View>
                <View className="info-item">
                  <Text className="info-label">接受加急</Text>
                  <Text className="info-value">{photographer.acceptsRushJobs ? '是' : '否'}</Text>
                </View>
              </View>
            </View>
            
            <View className="section">
              <View className="section-header">
                <Text className="section-title">使用器材</Text>
              </View>
              <View className="equipment-list">
                {photographer.equipments?.map((equipment, index) => (
                  <View key={index} className="equipment-item">
                    <AtIcon value="camera" size="16" color="#999" />
                    <Text className="equipment-name">{equipment}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </AtTabsPane>
        
        {/* 作品集标签页 */}
        <AtTabsPane current={currentTab} index={1}>
          <ScrollView scrollY className="tab-content">
            <View className="portfolio-grid">
              {photographer.portfolioImages?.map((image, index) => (
                <View 
                  key={index} 
                  className="portfolio-item"
                  onClick={() => viewPortfolio(image)}
                >
                  <Image src={image} className="portfolio-image" mode="aspectFill" />
                </View>
              ))}
            </View>
          </ScrollView>
        </AtTabsPane>
        
        {/* 可预约时间标签页 */}
        <AtTabsPane current={currentTab} index={2}>
          <ScrollView scrollY className="tab-content">
            {availabilityLoading ? (
              <View className="loading-container">
                <Text>加载可预约时间中...</Text>
              </View>
            ) : availableDates.length === 0 ? (
              <View className="empty-container">
                <Text>暂无可预约时间</Text>
              </View>
            ) : (
              <View className="availability-list">
                {availableDates.map((dateItem, index) => {
                  const dateInfo = formatDate(dateItem.date);
                  
                  return (
                    <View key={index} className="date-card">
                      <View className="date-header">
                        <View className="date-badge">
                          <Text className="date-day">{dateInfo.day}</Text>
                          <Text className="date-month">{dateInfo.month}月</Text>
                        </View>
                        <Text className="date-full">{dateInfo.full}</Text>
                      </View>
                      
                      <View className="time-slots">
                        {dateItem.slots.map((slot, slotIndex) => {
                          const startTime = slot.startTime.substring(0, 5);
                          const endTime = slot.endTime.substring(0, 5);
                          
                          return (
                            <View key={slotIndex} className="time-slot">
                              <AtIcon value="clock" size="14" color="#1890ff" />
                              <Text className="time-range">{startTime} - {endTime}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </AtTabsPane>
      </AtTabs>
      
      {/* 底部预约按钮 */}
      <View className="action-footer">
        <Button className="booking-button" onClick={goToBooking}>
          立即预约
        </Button>
      </View>
      
      {/* 图片预览浮层 */}
      <AtFloatLayout isOpened={previewVisible} onClose={closePreview}>
        <View className="image-preview">
          <Image src={selectedImage} mode="widthFix" className="preview-image" />
        </View>
      </AtFloatLayout>
    </View>
  );
};

export default PhotographerDetail;
