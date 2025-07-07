import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Progress } from '@tarojs/components';
import { AtIcon, AtTag, AtToast } from 'taro-ui';
import { getUserMembership, getMemberLevels } from '../../../services/membership';
import { formatDate } from '../../../utils/format';
import './index.scss';

const MembershipCenter: React.FC = () => {
  const [userMembership, setUserMembership] = useState<any>(null);
  const [memberLevels, setMemberLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [nextLevel, setNextLevel] = useState<any>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  // 获取会员信息
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        setLoading(true);
        
        // 并行获取会员信息和等级列表
        const [membershipRes, levelsRes] = await Promise.all([
          getUserMembership(),
          getMemberLevels()
        ]);
        
        setUserMembership(membershipRes.data);
        setMemberLevels(levelsRes.data);
        
        // 计算下一个等级和进度
        if (membershipRes.data && levelsRes.data.length > 0) {
          calculateNextLevel(membershipRes.data, levelsRes.data);
        }
      } catch (error) {
        console.error('获取会员信息失败:', error);
        showToast('获取会员信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  // 计算下一等级和进度
  const calculateNextLevel = (membership, levels) => {
    // 按照所需积分排序
    const sortedLevels = [...levels].sort((a, b) => a.requiredPoints - b.requiredPoints);
    
    // 找到当前等级
    const currentLevelIndex = sortedLevels.findIndex(level => level.id === membership.levelId);
    
    // 如果已经是最高等级
    if (currentLevelIndex === sortedLevels.length - 1) {
      setNextLevel(null);
      setProgressPercent(100);
      return;
    }
    
    // 获取下一个等级
    const nextLevelData = sortedLevels[currentLevelIndex + 1];
    setNextLevel(nextLevelData);
    
    // 计算进度百分比
    const currentPoints = membership.totalPoints;
    const currentLevelPoints = sortedLevels[currentLevelIndex].requiredPoints;
    const nextLevelPoints = nextLevelData.requiredPoints;
    
    const progressValue = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    setProgressPercent(Math.min(Math.max(progressValue, 0), 100));
  };

  // 显示提示消息
  const showToast = (text: string) => {
    setToastText(text);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2000);
  };

  // 跳转到积分详情页
  const handleViewPointsDetail = () => {
    Taro.navigateTo({
      url: '/pages/user/membership/points'
    });
  };

  // 跳转到优惠券页面
  const handleViewCoupons = () => {
    Taro.navigateTo({
      url: '/pages/user/coupons/index'
    });
  };

  // 跳转到会员权益说明页
  const handleViewPrivileges = () => {
    Taro.navigateTo({
      url: '/pages/user/membership/privileges'
    });
  };

  // 设置生日信息
  const handleSetBirthday = () => {
    Taro.navigateTo({
      url: '/pages/user/membership/birthday'
    });
  };

  if (loading) {
    return (
      <View className="membership-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!userMembership) {
    return (
      <View className="membership-error">
        <Text>获取会员信息失败，请重试</Text>
        <Button className="retry-button" onClick={() => Taro.reLaunch({ url: '/pages/user/membership/index' })}>
          重新加载
        </Button>
      </View>
    );
  }

  const { memberLevel, points, totalPoints, birthday } = userMembership;

  return (
    <View className="membership-page">
      {/* 会员卡片 */}
      <View className="member-card" style={{ background: `linear-gradient(135deg, ${memberLevel.color || '#1890ff'} 0%, #005bb5 100%)` }}>
        <View className="card-header">
          <Image className="level-icon" src={memberLevel.icon} />
          <Text className="level-name">{memberLevel.name}</Text>
          <AtTag size="small" className="level-tag">当前等级</AtTag>
        </View>
        
        <View className="card-content">
          <View className="points-info">
            <Text className="points-value">{points}</Text>
            <Text className="points-label">可用积分</Text>
          </View>
          
          <View className="user-info">
            <Text className="card-number">会员ID: {userMembership.id}</Text>
            <Text className="join-date">加入时间: {formatDate(userMembership.createdAt)}</Text>
          </View>
        </View>
        
        <Image className="card-background" src="/assets/images/card-bg-pattern.png" mode="aspectFill" />
      </View>
      
      {/* 等级进度 */}
      {nextLevel && (
        <View className="level-progress-container">
          <View className="progress-header">
            <Text className="progress-title">距离升级还需{nextLevel.requiredPoints - totalPoints}积分</Text>
            <Text className="progress-text" onClick={handleViewPointsDetail}>积分明细 &gt;</Text>
          </View>
          
          <View className="progress-bar">
            <Progress 
              percent={progressPercent} 
              strokeWidth={8} 
              active 
              activeColor={memberLevel.color || '#1890ff'} 
              backgroundColor="#e9e9e9" 
            />
          </View>
          
          <View className="progress-levels">
            <View className="current-level">
              <Image className="level-icon-small" src={memberLevel.icon} />
              <Text>{memberLevel.name}</Text>
            </View>
            <View className="next-level">
              <Image className="level-icon-small" src={nextLevel.icon} />
              <Text>{nextLevel.name}</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* 会员特权 */}
      <View className="privileges-container">
        <View className="section-header">
          <Text className="section-title">会员特权</Text>
          <Text className="section-more" onClick={handleViewPrivileges}>查看全部 &gt;</Text>
        </View>
        
        <View className="privileges-list">
          <View className="privilege-item">
            <AtIcon value="shopping-bag" size="24" color={memberLevel.color || '#1890ff'} />
            <Text className="privilege-name">会员折扣</Text>
            <Text className="privilege-desc">{(memberLevel.discountRate * 10).toFixed(1)}折优惠</Text>
          </View>
          
          {memberLevel.freeShipping && (
            <View className="privilege-item">
              <AtIcon value="shopping-cart" size="24" color={memberLevel.color || '#1890ff'} />
              <Text className="privilege-name">免邮特权</Text>
              <Text className="privilege-desc">部分商品免运费</Text>
            </View>
          )}
          
          {memberLevel.birthdayPrivilege && (
            <View className="privilege-item" onClick={handleSetBirthday}>
              <AtIcon value="calendar" size="24" color={memberLevel.color || '#1890ff'} />
              <Text className="privilege-name">生日礼遇</Text>
              <Text className="privilege-desc">
                {birthday ? '生日礼遇已设置' : '设置生日获礼包'}
              </Text>
            </View>
          )}
          
          <View className="privilege-item" onClick={handleViewCoupons}>
            <AtIcon value="credit-card" size="24" color={memberLevel.color || '#1890ff'} />
            <Text className="privilege-name">专属优惠券</Text>
            <Text className="privilege-desc">会员专享优惠</Text>
          </View>
        </View>
      </View>
      
      {/* 积分任务 */}
      <View className="tasks-container">
        <View className="section-header">
          <Text className="section-title">赚取积分</Text>
        </View>
        
        <View className="task-list">
          <View className="task-item">
            <View className="task-info">
              <Text className="task-name">每日签到</Text>
              <Text className="task-desc">每日签到获取5积分</Text>
            </View>
            <Button className="task-button">签到</Button>
          </View>
          
          <View className="task-item">
            <View className="task-info">
              <Text className="task-name">完善资料</Text>
              <Text className="task-desc">完善个人资料获取20积分</Text>
            </View>
            <Button className="task-button">去完善</Button>
          </View>
          
          <View className="task-item">
            <View className="task-info">
              <Text className="task-name">分享商品</Text>
              <Text className="task-desc">分享商品给好友获取10积分</Text>
            </View>
            <Button className="task-button">去分享</Button>
          </View>
        </View>
      </View>
      
      <AtToast
        isOpened={toastOpen}
        text={toastText}
        status="error"
      />
    </View>
  );
};

export default MembershipCenter;
