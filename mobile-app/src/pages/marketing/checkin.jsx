import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AppContext } from '@/store'
import './checkin.scss'

const CheckinPage = () => {
  const { state, dispatch } = useContext(AppContext)
  
  const [checkinData, setCheckinData] = useState({
    todayChecked: false,
    continuousCount: 0,
    currentMonth: new Date().getMonth() + 1,
    currentDay: new Date().getDate(),
    calendarDays: [],
    rewards: []
  })
  
  const [loading, setLoading] = useState(true)
  const [checkinLoading, setCheckinLoading] = useState(false)
  
  // 获取签到信息
  useEffect(() => {
    const fetchCheckinData = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 生成当月日历数据
          const today = new Date()
          const year = today.getFullYear()
          const month = today.getMonth()
          const date = today.getDate()
          
          // 当月的天数
          const daysInMonth = new Date(year, month + 1, 0).getDate()
          
          // 当月1号是星期几 (0-6, 0是星期日)
          const firstDayWeekday = new Date(year, month, 1).getDay()
          
          // 构建日历数组
          const calendarDays = []
          
          // 添加前一个月的剩余天数
          for (let i = 0; i < firstDayWeekday; i++) {
            calendarDays.push({
              day: null,
              inMonth: false,
              checked: false,
              isToday: false
            })
          }
          
          // 添加当月的天数
          for (let i = 1; i <= daysInMonth; i++) {
            // 模拟已签到数据，当天之前50%概率已签到
            const isChecked = i < date ? Math.random() > 0.5 : false
            
            calendarDays.push({
              day: i,
              inMonth: true,
              checked: isChecked,
              isToday: i === date
            })
          }
          
          // 签到奖励信息
          const rewards = [
            { days: 1, reward: 5, completed: true },
            { days: 3, reward: 15, completed: false },
            { days: 7, reward: 30, completed: false },
            { days: 15, reward: 50, completed: false },
            { days: 30, reward: 100, completed: false }
          ]
          
          // 计算连续签到天数
          let continuousCount = 0
          for (let i = date - 1; i >= 1; i--) {
            const dayIndex = firstDayWeekday + i - 1
            if (calendarDays[dayIndex] && calendarDays[dayIndex].checked) {
              continuousCount++
            } else {
              break
            }
          }
          
          // 更新奖励状态
          rewards.forEach(reward => {
            if (reward.days <= continuousCount) {
              reward.completed = true
            }
          })
          
          setCheckinData({
            todayChecked: false, // 默认今天未签到
            continuousCount,
            currentMonth: month + 1,
            currentDay: date,
            calendarDays,
            rewards
          })
          
          setLoading(false)
        }, 600)
      } catch (error) {
        console.error('获取签到数据失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchCheckinData()
  }, [])
  
  // 处理签到
  const handleCheckin = async () => {
    if (checkinData.todayChecked) {
      Taro.showToast({
        title: '今日已签到',
        icon: 'none'
      })
      return
    }
    
    setCheckinLoading(true)
    
    try {
      // 模拟签到请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新当天签到状态
      const todayIndex = checkinData.calendarDays.findIndex(day => day.isToday)
      if (todayIndex !== -1) {
        const newCalendarDays = [...checkinData.calendarDays]
        newCalendarDays[todayIndex].checked = true
        
        // 更新连续签到天数
        const newContinuousCount = checkinData.continuousCount + 1
        
        // 更新奖励状态
        const newRewards = checkinData.rewards.map(reward => ({
          ...reward,
          completed: reward.days <= newContinuousCount
        }))
        
        setCheckinData(prev => ({
          ...prev,
          todayChecked: true,
          continuousCount: newContinuousCount,
          calendarDays: newCalendarDays,
          rewards: newRewards
        }))
        
        // 显示签到成功
        Taro.showModal({
          title: '签到成功',
          content: `恭喜获得10积分，已连续签到${newContinuousCount}天`,
          showCancel: false
        })
        
        // 更新全局用户积分
        if (state.user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              ...state.user,
              points: (state.user.points || 0) + 10
            }
          })
        }
      }
      
    } catch (error) {
      Taro.showToast({
        title: '签到失败',
        icon: 'none'
      })
    } finally {
      setCheckinLoading(false)
    }
  }
  
  // 渲染日历格子
  const renderCalendarDay = (day, index) => {
    if (!day.inMonth) {
      return <View key={`empty-${index}`} className='calendar-day empty' />
    }
    
    return (
      <View 
        key={`day-${day.day}`} 
        className={`calendar-day ${day.checked ? 'checked' : ''} ${day.isToday ? 'today' : ''}`}
      >
        <Text className='day-number'>{day.day}</Text>
        {day.checked && <View className='checked-icon'>✓</View>}
      </View>
    )
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  return (
    <View className='checkin-page'>
      <View className='header-card'>
        <View className='info-section'>
          <View className='info-left'>
            <Text className='today-date'>{checkinData.currentMonth}月{checkinData.currentDay}日</Text>
            <Text className='continuous-days'>已连续签到 {checkinData.continuousCount} 天</Text>
          </View>
          <View className='info-right'>
            <Button
              className={`checkin-btn ${checkinData.todayChecked ? 'disabled' : ''}`}
              loading={checkinLoading}
              onClick={handleCheckin}
              disabled={checkinData.todayChecked}
            >
              {checkinData.todayChecked ? '已签到' : '签到'}
            </Button>
          </View>
        </View>
        
        <View className='calendar-section'>
          <View className='calendar-header'>
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <Text key={day} className='week-day'>{day}</Text>
            ))}
          </View>
          <View className='calendar-grid'>
            {checkinData.calendarDays.map(renderCalendarDay)}
          </View>
        </View>
      </View>
      
      <View className='rewards-card'>
        <View className='card-title'>
          <Text className='title-text'>签到奖励</Text>
        </View>
        <View className='rewards-list'>
          {checkinData.rewards.map((reward, index) => (
            <View 
              key={`reward-${index}`} 
              className={`reward-item ${reward.completed ? 'completed' : ''}`}
            >
              <View className='reward-badge'>
                <Text className='badge-text'>{reward.days}天</Text>
              </View>
              <View className='reward-info'>
                <Text className='reward-points'>+{reward.reward}积分</Text>
                <Text className='reward-status'>
                  {reward.completed ? '已获得' : `还需${reward.days - checkinData.continuousCount}天`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <View className='rules-card'>
        <View className='card-title'>
          <Text className='title-text'>规则说明</Text>
        </View>
        <View className='rules-content'>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每日签到可获得10积分</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>连续签到可获得额外奖励</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>积分可在会员中心兑换优惠券和礼品</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每天签到时间为00:00-23:59</Text>
          </View>
        </View>
      </View>
      
      {/* 积分明细入口 */}
      <View className='points-entry' onClick={() => Taro.navigateTo({ url: '/pages/marketing/points' })}>
        <Text className='entry-text'>查看积分明细</Text>
        <Text className='entry-arrow'>〉</Text>
      </View>
    </View>
  )
}

export default CheckinPage
