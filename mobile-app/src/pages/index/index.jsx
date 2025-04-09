import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

// 示例数据 - 移除TypeScript类型定义
const categories = [
  { id: '1', name: '婚纱摄影' },
  { id: '2', name: '儿童照' },
  { id: '3', name: '证件照' },
  { id: '4', name: '写真' }
]

const sampleProducts = [
  {
    id: '1',
    name: '精致写真套餐',
    price: 299,
    image: 'https://placekitten.com/300/300'
  },
  {
    id: '2',
    name: '专业婚纱摄影',
    price: 999,
    image: 'https://placekitten.com/300/301'
  }
]

// 辅助函数，用于渲染列表 - 移除TypeScript泛型和类型注解
function renderList(items, renderItem) {
  return React.createElement(
    React.Fragment,
    {},
    ...items.map(renderItem)
  );
}

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  // 独立提取渲染函数 - 移除类型注解
  const renderCategoryItem = (item) => (
    <View key={item.id} className='category-item'>
      <Text className='category-text'>{item.name}</Text>
    </View>
  );

  const renderProductItem = (product) => (
    <View key={product.id} className='product-card'>
      <Image 
        src={product.image} 
        className='product-image'
        mode='aspectFill'
      />
      <View className='product-info'>
        <Text className='product-name'>{product.name}</Text>
        <Text className='product-price'>￥{product.price}起</Text>
      </View>
    </View>
  );

  return (
    <View className='index-page'>
      {/* 顶部标题 */}
      <View className='header'>
        <Text className='title'>影楼商城首页</Text>
      </View>
      
      {/* 轮播图区域 */}
      <View className='banner-wrapper'>
        <Image 
          src='https://placekitten.com/750/400' 
          className='banner-image' 
          mode='aspectFill'
        />
      </View>
      
      {/* 分类区域 */}
      <View className='section'>
        <View className='section-title'>
          <Text className='title-text'>热门套餐</Text>
        </View>
        
        <ScrollView 
          scrollX 
          className='category-scroll'
          enhanced
          showScrollbar={false}
        >
          {/* 使用渲染辅助函数代替直接的map */}
          {renderList(categories, renderCategoryItem)}
        </ScrollView>
      </View>
      
      {/* 推荐商品区域 */}
      <View className='section'>
        <View className='section-title'>
          <Text className='title-text'>推荐套餐</Text>
        </View>
        
        <ScrollView scrollX className='product-scroll'>
          {/* 使用渲染辅助函数代替直接的map */}
          {renderList(sampleProducts, renderProductItem)}
        </ScrollView>
      </View>
    </View>
  )
}