import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtIcon, AtButton, AtToast } from 'taro-ui';
import { getActiveCouponTemplates, claimCoupon } from '../../../services/coupon';
import { formatDate } from '../../../utils/format';
import './center.scss';

const CouponCenter: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastStatus, setToastStatus] = useState<'success' | 'error' | 'loading' | ''>('');
  const [claiming, setClaiming] = useState<Record<number, boolean>>({});

  // 获取可领取的优惠券
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await getActiveCouponTemplates();
        setCoupons(res.data || []);
      } catch (error) {
        console.error('获取优惠券失败:', error);
        showToast('获取优惠券失败', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // 显示提示信息
  const showToast = (text: string, status: 'success' | 'error' | 'loading' | '' = 'error') => {
    setToastText(text);
    setToastStatus(status);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2000);
  };

  // 领取优惠券
  const handleClaimCoupon = async (templateId: number, index: number) => {
    try {
      // 标记正在领取
      setClaiming(prev => ({ ...prev, [templateId]: true }));
      
      // 调用领取接口
      await claimCoupon(templateId);
      
      // 更新优惠券状态
      const updatedCoupons = [...coupons];
      updatedCoupons[index] = {
        ...updatedCoupons[index],
        claimed: true
      };
      setCoupons(updatedCoupons);
      
      showToast('领取成功', 'success');
    } catch (error) {
      console.error('领取优惠券失败:', error);
      
      // 获取错误信息
      let errorMsg = '领取失败';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      
      showToast(errorMsg, 'error');
    } finally {
      // 取消标记
      setClaiming(prev => ({ ...prev, [templateId]: false }));
    }
  };

  // 格式化优惠券描述
  const formatCouponDescription = (coupon) => {
    const { type, discountAmount, discountRate, minAmount } = coupon;
    
    if (type === 'discount') {
      return `满${minAmount}元可用，${discountRate * 10}折优惠`;
    } else if (type === 'amount') {
      return `满${minAmount}元减${discountAmount}元`;
    } else if (type === 'free_shipping') {
      return `满${minAmount}元包邮`;
    }
    
    return '优惠券';
  };

  // 渲染优惠券面额
  const renderCouponValue = (coupon) => {
    const { type, discountAmount, discountRate } = coupon;
    
    if (type === 'discount') {
      return (
        <View className="coupon-value discount">
          <Text className="value-number">{discountRate * 10}</Text>
          <Text className="value-unit">折</Text>
        </View>
      );
    } else if (type === 'amount') {
      return (
        <View className="coupon-value amount">
          <Text className="value-symbol">¥</Text>
          <Text className="value-number">{discountAmount}</Text>
        </View>
      );
    } else if (type === 'free_shipping') {
      return (
        <View className="coupon-value free-shipping">
          <Text className="value-text">包邮</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <View className="coupon-center-page">
      <View className="header-banner">
        <Image 
          className="banner-image" 
          src="/assets/images/coupon-center-banner.jpg" 
          mode="aspectFill" 
        />
        <View className="banner-text">
          <Text className="title">优惠券中心</Text>
          <Text className="subtitle">领取优惠券，享受更多折扣</Text>
        </View>
      </View>
      
      <View className="coupon-container">
        {loading ? (
          <View className="loading-container">
            <Text>加载中...</Text>
          </View>
        ) : coupons.length === 0 ? (
          <View className="empty-container">
            <Image className="empty-image" src="/assets/images/empty-coupon.png" />
            <Text className="empty-text">暂无可领取的优惠券</Text>
          </View>
        ) : (
          <ScrollView className="coupon-scroll" scrollY>
            {coupons.map((coupon, index) => (
              <View key={coupon.id} className={`coupon-card ${coupon.claimed ? 'claimed' : ''}`}>
                <View className="coupon-left">
                  {renderCouponValue(coupon)}
                  <Text className="min-amount">
                    满{coupon.minAmount}元可用
                  </Text>
                </View>
                
                <View className="coupon-divider" />
                
                <View className="coupon-right">
                  <View className="coupon-info">
                    <Text className="coupon-name">{coupon.name}</Text>
                    <Text className="coupon-desc">
                      {formatCouponDescription(coupon)}
                    </Text>
                    <Text className="coupon-time">
                      有效期: {formatDate(coupon.startDate, 'YYYY.MM.DD')} - {formatDate(coupon.endDate, 'YYYY.MM.DD')}
                    </Text>
                  </View>
                  
                  <AtButton
                    type="primary"
                    size="small"
                    className={`claim-button ${coupon.claimed ? 'claimed' : ''}`}
                    disabled={coupon.claimed || claiming[coupon.id]}
                    loading={claiming[coupon.id]}
                    onClick={() => !coupon.claimed && handleClaimCoupon(coupon.id, index)}
                  >
                    {coupon.claimed ? '已领取' : '立即领取'}
                  </AtButton>
                </View>
                
                {(coupon.applicableCategories || coupon.applicableProducts) && (
                  <View className="coupon-restrictions">
                    <Text className="restrictions-text">
                      {coupon.applicableCategories ? '限定分类可用' : '限定商品可用'}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      
      <View className="bottom-navigation">
        <AtButton 
          type="primary" 
          className="view-my-coupon-button"
          onClick={() => Taro.navigateBack()}
        >
          查看我的优惠券
        </AtButton>
      </View>
      
      <AtToast
        isOpened={toastOpen}
        text={toastText}
        status={toastStatus}
      />
    </View>
  );
};

export default CouponCenter;
