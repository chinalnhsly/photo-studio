import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './detail.scss'

// 预约状态配置
const statusConfig = {
  upcoming: { 
    title: '待拍摄', 
    desc: '请按照预约时间到店',
    class: 'status-upcoming'
  },
  completed: { 
    title: '已完成', 
    desc: '感谢您的光临',
    class: 'status-completed'
  },
  cancelled: { 
    title: '已取消', 
    desc: '您已取消该预约',
    class: 'status-cancelled'
  }
};

const BookingDetailPage = () => {
  const router = useRouter();
  const { id } = router.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      // 模拟预约详情数据
      setBooking({
        id,
        status: 'upcoming',
        productName: '婚纱照套餐',
        productImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
        price: 3999,
        bookingTime: '2023-08-20 14:00-16:00',
        location: '时光影像旗舰店',
        address: '北京市朝阳区建国路88号',
        contactPerson: '张先生',
        contactPhone: '138****1234',
        createTime: '2023-07-15 18:30:25',
        orderNo: 'B202307150023',
        paymentMethod: '微信支付'
      });
      setLoading(false);
    }, 800);
  }, [id]);
  
  if (loading) {
    return (
      <View className='loading'>
        <Text className='message'>加载中...</Text>
      </View>
    );
  }
  
  if (!booking) {
    return (
      <View className='error'>
        <Text className='message'>无法找到该预约记录</Text>
        <View 
          className='btn'
          onClick={() => Taro.navigateBack()}
        >
          返回
        </View>
      </View>
    );
  }
  
  const status = statusConfig[booking.status];
  
  return (
    <View className='booking-detail-page'>
      <View className={`status-bar ${status.class}`}>
        <Text className='status-title'>{status.title}</Text>
        <Text className='status-desc'>{status.desc}</Text>
      </View>
      
      <View className='card'>
        <Text className='card-title'>预约信息</Text>
        <View className='info-row'>
          <Text className='label'>预约时间</Text>
          <Text className='value'>{booking.bookingTime}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>预约门店</Text>
          <Text className='value'>{booking.location}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>门店地址</Text>
          <Text className='value'>{booking.address}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>联系人</Text>
          <Text className='value'>{booking.contactPerson}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>联系电话</Text>
          <Text className='value'>{booking.contactPhone}</Text>
        </View>
      </View>
      
      <View className='card'>
        <Text className='card-title'>商品信息</Text>
        <View className='product-info'>
          <Image className='product-image' src={booking.productImage} mode='aspectFill' />
          <View className='product-content'>
            <Text className='product-name'>{booking.productName}</Text>
            <Text className='product-price'>¥{booking.price}</Text>
          </View>
        </View>
        <View className='total-row'>
          <Text className='total-label'>总计:</Text>
          <Text className='total-price'>¥{booking.price}</Text>
        </View>
      </View>
      
      <View className='card'>
        <Text className='card-title'>订单信息</Text>
        <View className='info-row'>
          <Text className='label'>订单编号</Text>
          <Text className='value'>{booking.orderNo}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>创建时间</Text>
          <Text className='value'>{booking.createTime}</Text>
        </View>
        <View className='info-row'>
          <Text className='label'>支付方式</Text>
          <Text className='value'>{booking.paymentMethod}</Text>
        </View>
      </View>
      
      {booking.status === 'upcoming' && (
        <View className='action-bar'>
          <View 
            className='action-btn secondary'
            onClick={() => {
              Taro.showModal({
                title: '取消预约',
                content: '确定要取消该预约吗？',
                success: function (res) {
                  if (res.confirm) {
                    Taro.showToast({
                      title: '已取消预约',
                      icon: 'success'
                    });
                    setTimeout(() => {
                      Taro.navigateBack();
                    }, 1500);
                  }
                }
              });
            }}
          >
            取消预约
          </View>
          <View 
            className='action-btn primary'
            onClick={() => {
              Taro.makePhoneCall({
                phoneNumber: '400-123-4567'
              });
            }}
          >
            联系客服
          </View>
        </View>
      )}
    </View>
  );
};

export default BookingDetailPage;
