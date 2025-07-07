import React, { useState } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import './index.scss';

// 简化的登录页，不再依赖@/store
function Login(props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (!phone || !password) {
      Taro.showToast({ title: '请填写手机号和密码', icon: 'none' });
      return;
    }
    
    // 模拟登录成功
    Taro.showToast({ 
      title: '登录成功', 
      icon: 'success',
      success: () => {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    });
  };
  
  return (
    <View className='login-page'>
      <View className='login-header'>
        <Text className='login-title'>登录账号</Text>
        <Text className='login-subtitle'>登录后享受更多权益</Text>
      </View>
      
      <View className='login-form'>
        <View className='form-item'>
          <Input
            className='input'
            placeholder='请输入手机号'
            type='number'
            value={phone}
            onInput={e => setPhone(e.detail.value)}
          />
        </View>
        
        <View className='form-item'>
          <Input
            className='input'
            placeholder='请输入密码'
            password
            value={password}
            onInput={e => setPassword(e.detail.value)}
          />
        </View>
        
        <Button className='login-button' onClick={handleLogin}>登录</Button>
        
        <View className='login-options'>
          <Text className='register'>注册账号</Text>
          <Text className='forgot-password'>忘记密码</Text>
        </View>
      </View>
    </View>
  );
}

export default Login;
