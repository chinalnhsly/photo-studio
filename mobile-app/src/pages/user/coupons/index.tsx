import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtButton, AtIcon } from 'taro-ui';
import { getUserCoupons } from '../../../services/coupon';
import { formatDate } from '../../../utils/format';
import './index.scss';

// 优惠券类型图标映射
const couponTypeIcons = {
  discount: 'tag',
  amount: 'money',
  free_shipping: 'shopping-cart'
};

const CouponList: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabList = [
    { title: '未使用' },
    { title: '已使用' },
    { title: '已过期' }
  ];

  const couponStatusMap = ['unused', 'used', 'expired'];

  // 获取优惠券列表
  useEffect(() => {
    fetchCoupons(couponStatusMap[currentTab]);
  }, [currentTab]);

  // 获取优惠券数据
  const fetchCoupons = async (status: string) => {
    try {
      setLoading(true);
      const res = await getUserCoupons(status);
      setCoupons(res.data || []);
    } catch (error) {
      console.error('获取优惠券失败:', error);
      Taro.showToast({
        title: '获取优惠券失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理标签页切换
  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  // 跳转到优惠券中心
  const handleGoToCouponCenter = () => {
    Taro.navigateTo({
      url: '/pages/user/coupons/center'
    });
  };

  // 格式化优惠券描述
  const formatCouponDescription = (coupon) => {
    const { type, discountAmount, discountRate, minAmount } = coupon.couponTemplate;
    
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
    const { type, discountAmount, discountRate } = coupon.couponTemplate;
    
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
    <View className="coupon-list-page">
      <AtTabs
        current={currentTab}
        tabList={tabList}
        onClick={handleTabClick}
      >
        {tabList.map((tab, index) => (
          <AtTabsPane key={index} current={currentTab} index={index}>
            <View className="tab-content">
              {loading ? (
                <View className="loading-container">
                  <Text>加载中...</Text>
                </View>
              ) : coupons.length === 0 ? (
                <View className="empty-container">
                  <Image className="empty-image" src="/assets/images/empty-coupon.png" />
                  <Text className="empty-text">暂无{tab.title}优惠券</Text>
                  {index === 0 && (
                    <AtButton
                      type="primary"
                      size="small"
                      className="get-coupon-button"
                      onClick={handleGoToCouponCenter}
                    >
                      去领取优惠券
                    </AtButton>
                  )}
                </View>
              ) : (
                <ScrollView className="coupon-scroll" scrollY>
                  {coupons.map(coupon => (
                    <View key={coupon.id} className={`coupon-card ${coupon.status}`}>
                      <View className="coupon-left">
                        {renderCouponValue(coupon)}
                        <Text className="min-amount">
                          满{coupon.couponTemplate.minAmount}元可用
                        </Text>
                      </View>
                      
                      <View className="coupon-divider" />
                      
                      <View className="coupon-right">
                        <View className="coupon-info">
                          <View className="coupon-name">
                            <AtIcon 
                              value={couponTypeIcons[coupon.couponTemplate.type] || 'tag'}
                              size="16" 
                              color="#1890ff" 
                            />
                            <Text>{coupon.couponTemplate.name}</Text>
                          </View>
                          <Text className="coupon-desc">
                            {formatCouponDescription(coupon)}
                          </Text>
                          <Text className="coupon-time">
                            {formatDate(coupon.startDate, 'YYYY.MM.DD')} - {formatDate(coupon.endDate, 'YYYY.MM.DD')}
                          </Text>
                        </View>
                        
                        {coupon.status === 'unused' ? (
                          <AtButton
                            type="primary"
                            size="small"
                            className="use-button"
                            onClick={() => Taro.switchTab({ url: '/pages/category/index' })}
                          >
                            去使用
                          </AtButton>
                        ) : coupon.status === 'used' ? (
                          <View className="coupon-status-tag used">
                            <Text>已使用</Text>
                          </View>
                        ) : (
                          <View className="coupon-status-tag expired">
                            <Text>已过期</Text>
                          </View>
                        )}
                      </View>
                      
                      {(coupon.couponTemplate.applicableCategories || coupon.couponTemplate.applicableProducts) && (
                        <View className="coupon-restrictions">
                          <Text className="restrictions-text">
                            {coupon.couponTemplate.applicableCategories ? '限定分类可用' : '限定商品可用'}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </AtTabsPane>
        ))}
      </AtTabs>
      
      {currentTab === 0 && (
        <View className="bottom-button-container">
          <AtButton 
            type="primary" 
            className="get-more-button"
            onClick={handleGoToCouponCenter}
          >
            领取更多优惠券
          </AtButton>
        </View>
      )}
    </View>
  );
};

export default CouponList;
