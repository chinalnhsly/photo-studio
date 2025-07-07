import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtLoadMore, AtIcon, AtTag } from 'taro-ui';
import { getUserBookings, cancelBooking } from '../../../services/booking';
import './index.scss';

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

const BookingList: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchBookings();
  }, [current]);
  
  // 获取预约列表
  const fetchBookings = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // 根据当前选项卡确定状态过滤
      let status = '';
      switch (current) {
        case 0: // 全部
          status = '';
          break;
        case 1: // 待确认
          status = 'pending';
          break;
        case 2: // 已确认
          status = 'confirmed';
          break;
        case 3: // 已完成
          status = 'completed';
          break;
        case 4: // 已取消
          status = 'cancelled,rescheduled';
          break;
        default:
          status = '';
      }
      
      const params = {
        page: pageNum,
        limit: 10,
        status
      };
      
      const response = await getUserBookings(params);
      
      if (pageNum === 1) {
        setBookings(response.data.items);
      } else {
        setBookings([...bookings, ...response.data.items]);
      }
      
      setPage(pageNum);
      setHasMore(response.data.items.length === 10);
    } catch (error) {
      console.error('获取预约列表失败:', error);
      Taro.showToast({
        title: '获取预约列表失败',
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
      fetchBookings(page + 1);
    }
  };
  
  // 查看预约详情
  const viewBookingDetail = (id: number) => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${id}`
    });
  };
  
  // 取消预约
  const handleCancelBooking = async (id: number, e: any) => {
    e.stopPropagation();
    
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消该预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelBooking(id);
            Taro.showToast({
              title: '预约已取消',
              icon: 'success'
            });
            
            // 刷新列表
            fetchBookings(1);
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
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 格式化时间
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };
  
  return (
    <View className="booking-list-page">
      <AtTabs
        current={current}
        tabList={[
          { title: '全部' },
          { title: '待确认' },
          { title: '已确认' },
          { title: '已完成' },
          { title: '已取消' }
        ]}
        onClick={handleTabClick}
        swipeable={false}
      >
        {Array(5).fill(0).map((_, index) => (
          <AtTabsPane key={index} current={current} index={index}>
            {loading ? (
              <View className="loading-container">
                <Text>加载中...</Text>
              </View>
            ) : bookings.length === 0 ? (
              <View className="empty-container">
                <Image 
                  className="empty-icon"
                  src="/assets/images/empty-bookings.png"
                />
                <Text className="empty-text">暂无预约记录</Text>
              </View>
            ) : (
              <ScrollView
                scrollY
                className="booking-scroll"
                onScrollToLower={loadMore}
              >
                <View className="booking-items">
                  {bookings.map(booking => (
                    <View 
                      key={booking.id}
                      className="booking-item"
                      onClick={() => viewBookingDetail(booking.id)}
                    >
                      <View className="status-badge" style={{ backgroundColor: statusColorMap[booking.status] }}>
                        {statusMap[booking.status]}
                      </View>
                      
                      <View className="booking-header">
                        <Image 
                          className="avatar"
                          src={booking.photographer?.avatar}
                          mode="aspectFill"
                        />
                        <Text className="photographer-name">{booking.photographer?.name}</Text>
                        <Text className="booking-number">预约号: {booking.bookingNumber}</Text>
                      </View>
                      
                      <View className="booking-info">
                        <View className="info-row">
                          <View className="info-item">
                            <AtIcon value="calendar" size="16" color="#999" />
                            <Text className="info-label">拍摄日期</Text>
                            <Text className="info-value">{formatDate(booking.bookingDate)}</Text>
                          </View>
                          <View className="info-item">
                            <AtIcon value="clock" size="16" color="#999" />
                            <Text className="info-label">时间段</Text>
                            <Text className="info-value">
                              {formatTime(booking.startTime)}-{formatTime(booking.endTime)}
                            </Text>
                          </View>
                        </View>
                        
                        <View className="product-info">
                          <Text className="product-name" numberOfLines={1}>
                            {booking.product?.name}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="booking-footer">
                        <Text className="booking-time">
                          预约时间: {formatDate(booking.createdAt)}
                        </Text>
                        
                        {booking.status === 'pending' && (
                          <View 
                            className="cancel-button"
                            onClick={(e) => handleCancelBooking(booking.id, e)}
                          >
                            取消预约
                          </View>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <AtTag size="small" type="primary">
                            准时参加
                          </AtTag>
                        )}
                        
                        {booking.status === 'completed' && (
                          <View 
                            className="review-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              Taro.navigateTo({
                                url: `/pages/order/review?bookingId=${booking.id}`
                              });
                            }}
                          >
                            评价预约
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                
                {loadingMore && <AtLoadMore status="loading" />}
                
                {!hasMore && bookings.length > 0 && (
                  <View className="no-more">
                    <Text>没有更多预约了</Text>
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

export default BookingList;
