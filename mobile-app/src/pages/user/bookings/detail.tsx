import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon, AtSteps, AtTimeline, AtTag } from 'taro-ui';
import { getBookingDetail, cancelBooking } from '../../../services/booking';
import './detail.scss';

const statusMap = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
  rescheduled: '已改期'
};

const statusColorMap = {
  pending: '#faad14',
  confirmed: '#1890ff',
  completed: '#52c41a',
  cancelled: '#f5222d',
  rescheduled: '#722ed1'
};

const BookingDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  
  useEffect(() => {
    if (!id) return;
    
    fetchBookingDetail();
  }, [id]);
  
  // 获取预约详情
  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await getBookingDetail(Number(id));
      setBooking(response.data);
      
      // 构建预约时间线
      generateTimeline(response.data);
    } catch (error) {
      console.error('获取预约详情失败:', error);
      Taro.showToast({
        title: '获取预约详情失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 生成预约时间线
  const generateTimeline = (bookingData: any) => {
    const timelineItems = [];
    
    // 创建预约
    timelineItems.push({
      title: '创建预约',
      content: [
        `预约编号: ${bookingData.bookingNumber}`,
        `创建时间: ${formatDateTime(bookingData.createdAt)}`
      ],
      icon: 'calendar',
      color: '#1890ff'
    });
    
    // 根据状态添加不同节点
    if (bookingData.status === 'confirmed' || bookingData.status === 'completed') {
      timelineItems.push({
        title: '预约确认',
        content: [
          `确认时间: ${formatDateTime(bookingData.updatedAt)}`,
          '商家已确认您的预约'
        ],
        icon: 'check-circle',
        color: '#52c41a'
      });
    }
    
    if (bookingData.status === 'completed') {
      timelineItems.push({
        title: '拍摄完成',
        content: [
          `完成时间: ${formatDateTime(bookingData.updatedAt)}`,
          '拍摄已完成'
        ],
        icon: 'camera',
        color: '#faad14'
      });
    }
    
    if (bookingData.status === 'cancelled') {
      timelineItems.push({
        title: '预约取消',
        content: [
          `取消时间: ${formatDateTime(bookingData.updatedAt)}`,
          `取消原因: ${bookingData.cancellationReason || '用户取消'}`
        ],
        icon: 'close-circle',
        color: '#f5222d'
      });
    }
    
    if (bookingData.status === 'rescheduled') {
      timelineItems.push({
        title: '预约改期',
        content: [
          `改期时间: ${formatDateTime(bookingData.updatedAt)}`,
          `原预约日期: ${formatDate(bookingData.originalBookingDate)}`
        ],
        icon: 'reload',
        color: '#722ed1'
      });
    }
    
    setTimeline(timelineItems);
  };
  
  // 返回上一页
  const goBack = () => {
    Taro.navigateBack();
  };
  
  // 取消预约
  const handleCancelBooking = async () => {
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消该预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelBooking(Number(id));
            Taro.showToast({
              title: '预约已取消',
              icon: 'success'
            });
            
            // 刷新预约详情
            fetchBookingDetail();
          } catch (error) {
            console.error('取消预约失败:', error);
            Taro.showToast({
              title: '取消预约失败',
              icon: 'none'
            });
          }
        }
      }
    });
  };
  
  // 提交评价
  const handleSubmitReview = () => {
    Taro.navigateTo({
      url: `/pages/order/review?bookingId=${id}`
    });
  };
  
  // 联系客服
  const handleContactService = () => {
    // 调用客服功能或拨打电话
    Taro.makePhoneCall({
      phoneNumber: '400-123-4567',
      fail: () => {
        Taro.showToast({
          title: '拨打电话失败',
          icon: 'none'
        });
      }
    });
  };
  
  // 添加日历提醒
  const addCalendarReminder = () => {
    Taro.showToast({
      title: '已添加至日历提醒',
      icon: 'success'
    });
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 格式化时间
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };
  
  // 格式化日期时间
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return `${formatDate(dateTimeStr)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 获取当前预约状态的步骤
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'completed':
        return 2;
      case 'cancelled':
        return -1;
      case 'rescheduled':
        return -1;
      default:
        return 0;
    }
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
        <Button className="back-button" onClick={goBack}>返回</Button>
      </View>
    );
  }
  
  return (
    <View className="booking-detail-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">预约详情</Text>
      </View>
      
      {/* 状态卡片 */}
      <View className="status-card">
        <View 
          className="status-icon" 
          style={{ backgroundColor: statusColorMap[booking.status] }}
        >
          <AtIcon value={
            booking.status === 'pending' ? 'clock' :
            booking.status === 'confirmed' ? 'check-circle' :
            booking.status === 'completed' ? 'check-circle' :
            booking.status === 'cancelled' ? 'close-circle' :
            'reload'
          } size="24" color="#fff" />
        </View>
        <View className="status-info">
          <Text className="status-text">{statusMap[booking.status]}</Text>
          <Text className="status-desc">
            {booking.status === 'pending' ? '您的预约等待商家确认' :
             booking.status === 'confirmed' ? '商家已确认您的预约' :
             booking.status === 'completed' ? '您的预约已完成' :
             booking.status === 'cancelled' ? '您的预约已取消' :
             '您的预约已改期'}
          </Text>
        </View>
      </View>
      
      {/* 预约流程 */}
      {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'completed') && (
        <View className="process-card">
          <AtSteps
            items={[
              { title: '待确认', desc: '商家确认' },
              { title: '已确认', desc: '准备拍摄' },
              { title: '已完成', desc: '拍摄结束' },
            ]}
            current={getStepIndex(booking.status)}
          />
        </View>
      )}
      
      {/* 预约详情 */}
      <View className="info-card">
        <View className="card-header">
          <Text className="card-title">预约信息</Text>
          <AtTag size="small" type="primary" className="booking-number">
            {booking.bookingNumber}
          </AtTag>
        </View>
        
        <View className="info-content">
          <View className="photographer-info">
            <Image 
              className="avatar"
              src={booking.photographer?.avatar}
              mode="aspectFill"
            />
            <View className="photographer-details">
              <Text className="photographer-name">{booking.photographer?.name}</Text>
              <View className="rating-row">
                <View className="stars">
                  {Array(5).fill(0).map((_, i) => (
                    <Text 
                      key={i} 
                      className={`star ${i < Math.floor(booking.photographer?.rating || 0) ? 'filled' : ''}`}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
          
          <View className="booking-info-grid">
            <View className="info-item">
              <Text className="info-label">拍摄日期</Text>
              <Text className="info-value">{formatDate(booking.bookingDate)}</Text>
            </View>
            <View className="info-item">
              <Text className="info-label">时间段</Text>
              <Text className="info-value">{formatTime(booking.startTime)}-{formatTime(booking.endTime)}</Text>
            </View>
            <View className="info-item">
              <Text className="info-label">拍摄地点</Text>
              <Text className="info-value">{booking.location || '影楼门店'}</Text>
            </View>
            <View className="info-item">
              <Text className="info-label">预约项目</Text>
              <Text className="info-value ellipsis">{booking.product?.name}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* 备注信息 */}
      {booking.customerNotes && (
        <View className="notes-card">
          <View className="card-header">
            <Text className="card-title">备注信息</Text>
          </View>
          <Text className="notes-content">{booking.customerNotes}</Text>
        </View>
      )}
      
      {/* 预约时间线 */}
      <View className="timeline-card">
        <View className="card-header">
          <Text className="card-title">预约流程</Text>
        </View>
        <AtTimeline
          items={timeline}
          pending={booking.status === 'pending' || booking.status === 'confirmed'}
        />
      </View>
      
      {/* 底部操作 */}
      <View className="action-footer">
        {booking.status === 'pending' && (
          <>
            <Button 
              className="action-button secondary"
              onClick={handleContactService}
            >
              联系客服
            </Button>
            <Button 
              className="action-button primary"
              onClick={handleCancelBooking}
            >
              取消预约
            </Button>
          </>
        )}
        
        {booking.status === 'confirmed' && (
          <>
            <Button 
              className="action-button secondary"
              onClick={addCalendarReminder}
            >
              <AtIcon value="calendar" size="14" color="#1890ff" />
              添加提醒
            </Button>
            <Button 
              className="action-button primary"
              onClick={handleContactService}
            >
              联系客服
            </Button>
          </>
        )}
        
        {booking.status === 'completed' && (
          <Button 
            className="action-button primary full"
            onClick={handleSubmitReview}
          >
            评价预约
          </Button>
        )}
        
        {(booking.status === 'cancelled' || booking.status === 'rescheduled') && (
          <Button 
            className="action-button secondary full"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/booking/photographer?id=${booking.photographer.id}`
              });
            }}
          >
            重新预约
          </Button>
        )}
      </View>
    </View>
  );
};

export default BookingDetail;
