import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtIcon, AtLoadMore } from 'taro-ui';
import { getUserPointRecords, getUserMembership } from '../../../services/membership';
import { formatDate } from '../../../utils/format';
import './points.scss';

const PointsHistory: React.FC = () => {
  const [userMembership, setUserMembership] = useState<any>(null);
  const [pointRecords, setPointRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 获取会员信息和积分记录
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并行获取会员信息和积分记录
        const [membershipRes, recordsRes] = await Promise.all([
          getUserMembership(),
          getUserPointRecords(1, 20)
        ]);
        
        setUserMembership(membershipRes.data);
        setPointRecords(recordsRes.data);
        setHasMore(recordsRes.data.length === 20);
        setPage(1);
      } catch (error) {
        console.error('获取积分记录失败:', error);
        Taro.showToast({
          title: '获取积分记录失败',
          icon: 'none'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 加载更多记录
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const res = await getUserPointRecords(nextPage, 20);
      
      if (res.data.length > 0) {
        setPointRecords(prev => [...prev, ...res.data]);
        setPage(nextPage);
      }
      
      setHasMore(res.data.length === 20);
    } catch (error) {
      console.error('加载更多积分记录失败:', error);
      Taro.showToast({
        title: '加载更多失败',
        icon: 'none'
      });
    } finally {
      setLoadingMore(false);
    }
  };

  // 获取记录类型显示信息
  const getRecordTypeInfo = (type: string) => {
    switch (type) {
      case 'earn':
        return { text: '获得积分', color: '#52c41a', icon: 'add-circle' };
      case 'spend':
        return { text: '消费积分', color: '#ff4d4f', icon: 'subtract-circle' };
      case 'expire':
        return { text: '积分过期', color: '#faad14', icon: 'close-circle' };
      case 'adjust':
        return { text: '积分调整', color: '#1890ff', icon: 'reload' };
      default:
        return { text: '其他变动', color: '#999', icon: 'help' };
    }
  };

  if (loading) {
    return (
      <View className="points-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!userMembership) {
    return (
      <View className="points-error">
        <Text>获取会员信息失败，请重试</Text>
      </View>
    );
  }

  return (
    <View className="points-page">
      {/* 积分概览 */}
      <View className="points-overview">
        <View className="current-points">
          <Text className="label">当前可用积分</Text>
          <Text className="value">{userMembership.points}</Text>
        </View>
        
        <View className="points-detail">
          <View className="detail-item">
            <Text className="label">累计积分</Text>
            <Text className="value">{userMembership.totalPoints}</Text>
          </View>
          
          <View className="separator" />
          
          <View className="detail-item">
            <Text className="label">已使用积分</Text>
            <Text className="value">{userMembership.totalPoints - userMembership.points}</Text>
          </View>
        </View>
      </View>
      
      {/* 积分记录列表 */}
      <View className="records-container">
        <View className="records-header">
          <Text className="title">积分明细</Text>
          <Text className="subtitle">记录最近90天内的积分变动</Text>
        </View>
        
        {pointRecords.length === 0 ? (
          <View className="empty-records">
            <Image className="empty-image" src="/assets/images/empty-records.png" />
            <Text className="empty-text">暂无积分记录</Text>
          </View>
        ) : (
          <ScrollView
            className="records-scroll"
            scrollY
            scrollWithAnimation
            onScrollToLower={loadMore}
          >
            {pointRecords.map(record => {
              const typeInfo = getRecordTypeInfo(record.type);
              const isPositive = ['earn', 'adjust'].includes(record.type) && record.points > 0;
              
              return (
                <View key={record.id} className="record-item">
                  <View className="record-icon">
                    <AtIcon value={typeInfo.icon} size="20" color={typeInfo.color} />
                  </View>
                  
                  <View className="record-info">
                    <Text className="record-desc">{record.description}</Text>
                    <Text className="record-time">{formatDate(record.createdAt)}</Text>
                  </View>
                  
                  <Text 
                    className="record-points" 
                    style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}
                  >
                    {isPositive ? '+' : ''}{record.points}
                  </Text>
                </View>
              );
            })}
            
            {loadingMore && (
              <AtLoadMore status="loading" />
            )}
            
            {!hasMore && pointRecords.length > 0 && (
              <View className="no-more">
                <Text>没有更多记录了</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
      
      {/* 积分规则 */}
      <View className="rules-container">
        <View className="rules-header">
          <Text className="title">积分规则</Text>
        </View>
        
        <View className="rule-item">
          <Text className="rule-title">如何获取积分</Text>
          <Text className="rule-content">• 消费1元获得1积分</Text>
          <Text className="rule-content">• 每日签到获得5积分</Text>
          <Text className="rule-content">• 完善个人资料获得20积分</Text>
          <Text className="rule-content">• 分享商品给好友获得10积分</Text>
        </View>
        
        <View className="rule-item">
          <Text className="rule-title">积分使用规则</Text>
          <Text className="rule-content">• 100积分可抵扣1元现金</Text>
          <Text className="rule-content">• 积分可兑换优惠券</Text>
          <Text className="rule-content">• 部分商品可使用积分兑换</Text>
        </View>
        
        <View className="rule-item">
          <Text className="rule-title">积分有效期</Text>
          <Text className="rule-content">• 积分有效期为获得之日起两年</Text>
          <Text className="rule-content">• 即将过期的积分我们会提前通知您</Text>
        </View>
      </View>
    </View>
  );
};

export default PointsHistory;
