import React, { useContext, useState } from 'react'
import { View, Text, Switch, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AppContext } from '@/store'
import './index.scss'

const Settings = () => {
  const appContext = useContext(AppContext)
  const [darkMode, setDarkMode] = useState(appContext.theme === 'dark')
  
  const handleThemeChange = (e) => {
    const isDark = e.detail.value
    setDarkMode(isDark)
    
    // 如果 appContext 有 updateContext 方法
    if (appContext.updateContext) {
      appContext.updateContext({
        ...appContext,
        theme: isDark ? 'dark' : 'light'
      })
    }
    
    Taro.showToast({
      title: `已切换到${isDark ? '深色' : '浅色'}模式`,
      icon: 'none'
    })
  }
  
  const handleClearCache = () => {
    Taro.showLoading({ title: '清理中...' })
    
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '缓存已清理',
        icon: 'success'
      })
    }, 1500)
  }
  
  return (
    <View className='settings-page'>
      <View className='settings-section'>
        <View className='settings-item'>
          <Text className='label'>深色模式</Text>
          <Switch checked={darkMode} onChange={handleThemeChange} color='#ff6b81' />
        </View>
        
        <View className='settings-item'>
          <Text className='label'>语言</Text>
          <Text className='value'>简体中文</Text>
        </View>
      </View>
      
      <View className='settings-section'>
        <View className='settings-item'>
          <Text className='label'>当前版本</Text>
          <Text className='value'>1.0.0</Text>
        </View>
        
        <Button className='clear-cache-btn' onClick={handleClearCache}>
          清理缓存
        </Button>
      </View>
    </View>
  )
}

export default Settings
