import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const AddressListPage = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 加载地址列表
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 模拟地址数据
          const mockAddresses = [
            {
              id: 'addr1',
              name: '张三',
              phone: '13800138000',
              province: '北京市',
              city: '北京市',
              district: '朝阳区',
              detailAddress: '建国路88号中央公馆B座2201',
              isDefault: true
            },
            {
              id: 'addr2',
              name: '李四',
              phone: '13900139000',
              province: '上海市',
              city: '上海市',
              district: '浦东新区',
              detailAddress: '张杨路500号华润时代广场2501',
              isDefault: false
            }
          ]
          
          setAddresses(mockAddresses)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('获取地址列表失败:', error)
        Taro.showToast({
          title: '加载地址失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchAddresses()
  }, [])
  
  // 编辑地址
  const handleEdit = (address) => {
    Taro.navigateTo({
      url: `/pages/user/address/edit?id=${address.id}`
    })
  }
  
  // 删除地址
  const handleDelete = (address) => {
    Taro.showModal({
      title: '删除地址',
      content: '确定要删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          // 模拟删除操作
          const newAddresses = addresses.filter(item => item.id !== address.id)
          setAddresses(newAddresses)
          
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
  
  // 设为默认地址
  const handleSetDefault = (address) => {
    if (address.isDefault) return
    
    const newAddresses = addresses.map(item => ({
      ...item,
      isDefault: item.id === address.id
    }))
    
    setAddresses(newAddresses)
    
    Taro.showToast({
      title: '已设为默认地址',
      icon: 'success'
    })
  }
  
  // 添加新地址
  const handleAddNew = () => {
    Taro.navigateTo({
      url: '/pages/user/address/edit'
    })
  }
  
  // 选择地址并返回
  const handleSelect = (address) => {
    const pages = Taro.getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    // 如果是从其他页面跳转来选择地址
    if (prevPage && prevPage.route.includes('booking/form')) {
      // 将选择的地址传回上一页
      Taro.navigateBack({
        success: () => {
          // 此处调用上一页的函数更新地址
          prevPage.setSelectedAddress && prevPage.setSelectedAddress(address)
        }
      })
    }
  }
  
  // 渲染地址项
  const renderAddressItem = (address) => {
    const fullAddress = `${address.province}${address.city}${address.district}${address.detailAddress}`
    
    return (
      <View key={address.id} className='address-item'>
        <View 
          className='address-content'
          onClick={() => handleSelect(address)}
        >
          <View className='address-info'>
            <View className='info-row'>
              <Text className='name'>{address.name}</Text>
              <Text className='phone'>{address.phone}</Text>
              {address.isDefault && (
                <Text className='default-tag'>默认</Text>
              )}
            </View>
            <Text className='address-text'>{fullAddress}</Text>
          </View>
        </View>
        
        <View className='address-actions'>
          <View className='action-group'>
            <View className='action-btn' onClick={() => handleSetDefault(address)}>
              <View className={`checkbox ${address.isDefault ? 'checked' : ''}`}>
                {address.isDefault && <View className='check-icon'>✓</View>}
              </View>
              <Text className='action-text'>默认地址</Text>
            </View>
          </View>
          
          <View className='action-group'>
            <View className='action-btn' onClick={() => handleEdit(address)}>
              <Text className='action-text'>编辑</Text>
            </View>
            <Text className='divider'>|</Text>
            <View className='action-btn' onClick={() => handleDelete(address)}>
              <Text className='action-text'>删除</Text>
            </View>
          </View>
        </View>
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
    <View className='address-list-page'>
      <View className='address-list'>
        {addresses.length > 0 ? (
          addresses.map(address => renderAddressItem(address))
        ) : (
          <View className='empty-address'>
            <Image 
              className='empty-icon' 
              src='https://img.icons8.com/pastel-glyph/64/000000/address--v2.png'
            />
            <Text className='empty-text'>暂无收货地址</Text>
          </View>
        )}
      </View>
      
      <View className='bottom-bar'>
        <Button className='add-btn' onClick={handleAddNew}>
          新增收货地址
        </Button>
      </View>
    </View>
  )
}

export default AddressListPage
