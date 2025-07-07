import React, { useState, useEffect } from 'react'
import { View, Text, Input, Button, Picker, Switch } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './edit.scss'

// 中国省市区数据，实际项目中可能需要更完整的数据
const regions = [
  {
    label: '北京市',
    value: '北京市',
    children: [
      {
        label: '北京市',
        value: '北京市',
        children: [
          { label: '东城区', value: '东城区' },
          { label: '西城区', value: '西城区' },
          { label: '朝阳区', value: '朝阳区' },
          { label: '海淀区', value: '海淀区' }
        ]
      }
    ]
  },
  {
    label: '上海市',
    value: '上海市',
    children: [
      {
        label: '上海市',
        value: '上海市',
        children: [
          { label: '黄浦区', value: '黄浦区' },
          { label: '徐汇区', value: '徐汇区' },
          { label: '浦东新区', value: '浦东新区' }
        ]
      }
    ]
  }
]

const AddressEditPage = () => {
  const router = useRouter()
  const { id } = router.params
  
  const [addressInfo, setAddressInfo] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false
  })
  
  const [regionIndexes, setRegionIndexes] = useState([0, 0, 0])
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  
  // 加载地址信息（如果是编辑）
  useEffect(() => {
    if (id) {
      setIsEdit(true)
      setLoading(true)
      
      // 模拟API请求
      setTimeout(() => {
        // 模拟地址数据
        const mockAddress = {
          id,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detailAddress: '建国路88号中央公馆B座2201',
          isDefault: true
        }
        
        setAddressInfo(mockAddress)
        
        // 根据地址找到对应的索引
        const provinceIndex = regions.findIndex(p => p.value === mockAddress.province)
        if (provinceIndex >= 0) {
          const cityIndex = regions[provinceIndex].children.findIndex(c => c.value === mockAddress.city)
          if (cityIndex >= 0) {
            const districtIndex = regions[provinceIndex].children[cityIndex].children.findIndex(d => d.value === mockAddress.district)
            if (districtIndex >= 0) {
              setRegionIndexes([provinceIndex, cityIndex, districtIndex])
            }
          }
        }
        
        setLoading(false)
      }, 500)
    }
  }, [id])
  
  // 处理表单输入变化
  const handleInputChange = (field, value) => {
    setAddressInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 处理区域选择变化
  const handleRegionChange = (e) => {
    const indexes = e.detail.value
    setRegionIndexes(indexes)
    
    const province = regions[indexes[0]].value
    const city = regions[indexes[0]].children[indexes[1]].value
    const district = regions[indexes[0]].children[indexes[1]].children[indexes[2]].value
    
    setAddressInfo(prev => ({
      ...prev,
      province,
      city,
      district
    }))
  }
  
  // 处理默认地址切换
  const handleDefaultChange = (e) => {
    setAddressInfo(prev => ({
      ...prev,
      isDefault: e.detail.value
    }))
  }
  
  // 保存地址
  const handleSave = async () => {
    // 表单验证
    if (!addressInfo.name.trim()) {
      Taro.showToast({
        title: '请填写收货人姓名',
        icon: 'none'
      })
      return
    }
    
    if (!addressInfo.phone || !/^1[3-9]\d{9}$/.test(addressInfo.phone)) {
      Taro.showToast({
        title: '请填写正确的手机号',
        icon: 'none'
      })
      return
    }
    
    if (!addressInfo.province || !addressInfo.city || !addressInfo.district) {
      Taro.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return
    }
    
    if (!addressInfo.detailAddress.trim()) {
      Taro.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }
    
    setLoading(true)
    
    try {
      // 模拟API保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      Taro.showToast({
        title: isEdit ? '修改成功' : '添加成功',
        icon: 'success'
      })
      
      // 返回地址列表页
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      
    } catch (error) {
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 渲染区域选择器显示的文本
  const renderRegionText = () => {
    if (addressInfo.province && addressInfo.city && addressInfo.district) {
      return `${addressInfo.province} ${addressInfo.city} ${addressInfo.district}`
    }
    return '请选择'
  }
  
  return (
    <View className='address-edit-page'>
      <View className='form-section'>
        <View className='form-item'>
          <Text className='form-label'>收货人</Text>
          <Input
            className='form-input'
            placeholder='请填写收货人姓名'
            value={addressInfo.name}
            onInput={(e) => handleInputChange('name', e.detail.value)}
          />
        </View>
        
        <View className='form-item'>
          <Text className='form-label'>手机号码</Text>
          <Input
            className='form-input'
            type='number'
            placeholder='请填写收货人手机号'
            value={addressInfo.phone}
            maxlength={11}
            onInput={(e) => handleInputChange('phone', e.detail.value)}
          />
        </View>
        
        <View className='form-item'>
          <Text className='form-label'>所在地区</Text>
          <Picker
            mode='multiSelector'
            range={[
              regions.map(p => p.label),
              regions[regionIndexes[0]]?.children.map(c => c.label) || [],
              regions[regionIndexes[0]]?.children[regionIndexes[1]]?.children.map(d => d.label) || []
            ]}
            value={regionIndexes}
            onChange={handleRegionChange}
            onColumnChange={(e) => {
              const column = e.detail.column
              const index = e.detail.value
              
              const newIndexes = [...regionIndexes]
              newIndexes[column] = index
              
              // 如果修改了省或市，重置后面的选择
              if (column === 0) {
                newIndexes[1] = 0
                newIndexes[2] = 0
              } else if (column === 1) {
                newIndexes[2] = 0
              }
              
              setRegionIndexes(newIndexes)
            }}
          >
            <View className='picker-view'>
              <Text className={`picker-text ${addressInfo.province ? '' : 'placeholder'}`}>
                {renderRegionText()}
              </Text>
              <Text className='picker-arrow'>〉</Text>
            </View>
          </Picker>
        </View>
        
        <View className='form-item'>
          <Text className='form-label'>详细地址</Text>
          <Textarea
            className='form-textarea'
            placeholder='请填写详细地址，如街道名称、门牌号等'
            value={addressInfo.detailAddress}
            onInput={(e) => handleInputChange('detailAddress', e.detail.value)}
          />
        </View>
      </View>
      
      <View className='form-section'>
        <View className='switch-item'>
          <Text className='switch-label'>设为默认收货地址</Text>
          <Switch 
            checked={addressInfo.isDefault}
            onChange={handleDefaultChange}
            color='#ff6b81'
          />
        </View>
      </View>
      
      <View className='bottom-bar'>
        <Button 
          className='save-btn' 
          loading={loading}
          onClick={handleSave}
        >
          保存
        </Button>
      </View>
    </View>
  )
}

export default AddressEditPage
