import React, { useState } from 'react'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Register = () => {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [agreePolicy, setAgreePolicy] = useState(false)
  
  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    // 开始倒计时
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    // 模拟发送验证码API调用
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      Taro.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
    } catch (error) {
      Taro.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      })
    }
  }
  
  // 处理注册
  const handleRegister = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    if (!code) {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    
    if (!password || password.length < 6) {
      Taro.showToast({
        title: '密码不能少于6位',
        icon: 'none'
      })
      return
    }
    
    if (password !== confirmPassword) {
      Taro.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }
    
    if (!agreePolicy) {
      Taro.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      })
      return
    }
    
    try {
      setSubmitLoading(true)
      
      // 模拟API注册
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      Taro.showToast({
        title: '注册成功',
        icon: 'success'
      })
      
      // 跳转到登录页
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/user/login/index'
        })
      }, 1500)
      
    } catch (error) {
      Taro.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      })
    } finally {
      setSubmitLoading(false)
    }
  }
  
  return (
    <View className='register-page'>
      <View className='header'>
        <Image className='logo' src='https://img.icons8.com/color/452/camera.png' />
        <Text className='title'>注册新账号</Text>
        <Text className='sub-title'>加入我们，开启您的影像之旅</Text>
      </View>
      
      <View className='register-form'>
        <View className='form-item'>
          <View className='input-label'>手机号</View>
          <Input
            className='input'
            type='number'
            placeholder='请输入手机号'
            maxLength={11}
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
          />
        </View>
        
        <View className='form-item'>
          <View className='input-label'>验证码</View>
          <View className='code-input-container'>
            <Input
              className='code-input'
              type='number'
              placeholder='请输入验证码'
              maxLength={6}
              value={code}
              onInput={(e) => setCode(e.detail.value)}
            />
            <View 
              className={`code-btn ${countdown > 0 ? 'disabled' : ''}`}
              onClick={countdown === 0 ? handleSendCode : null}
            >
              {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
            </View>
          </View>
        </View>
        
        <View className='form-item'>
          <View className='input-label'>设置密码</View>
          <Input
            className='input'
            type='password'
            placeholder='请设置登录密码'
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>
        
        <View className='form-item'>
          <View className='input-label'>确认密码</View>
          <Input
            className='input'
            type='password'
            placeholder='请再次输入密码'
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.detail.value)}
          />
        </View>
        
        <View className='policy-checkbox' onClick={() => setAgreePolicy(!agreePolicy)}>
          <View className={`checkbox ${agreePolicy ? 'checked' : ''}`}>
            {agreePolicy && <View className='check-mark'>✓</View>}
          </View>
          <Text className='policy-text'>
            我已阅读并同意
            <Text className='policy-link'>《用户协议》</Text>
            和
            <Text className='policy-link'>《隐私政策》</Text>
          </Text>
        </View>
        
        <Button 
          className='register-btn' 
          loading={submitLoading}
          onClick={handleRegister}
        >
          注册
        </Button>
        
        <View className='login-link' onClick={() => Taro.navigateBack()}>
          已有账号？<Text className='link'>立即登录</Text>
        </View>
      </View>
    </View>
  )
}

export default Register
