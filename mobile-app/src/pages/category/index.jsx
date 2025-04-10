import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockApi } from '../../services/mock'
import './index.scss'

export default function CategoryPage() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    // 获取分类数据
    const fetchData = async () => {
      try {
        setLoading(true)
        const categoryData = await mockApi.getCategories()
        setCategories(categoryData)
        
        if (categoryData && categoryData.length > 0) {
          setCurrentCategory(categoryData[0])
          fetchProducts(categoryData[0].id)
        }
      } catch (error) {
        console.error('获取分类数据失败:', error)
        Taro.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
    }
    
    fetchData()
  }, [])
  
  // 获取分类下的产品
  const fetchProducts = async (categoryId) => {
    try {
      const result = await mockApi.getProducts({
        category: categoryId,
        page: 1,
        pageSize: 10
      })
      setProducts(result.list)
      setLoading(false)
    } catch (error) {
      console.error('获取产品列表失败:', error)
      setLoading(false)
    }
  }
  
  // 切换分类
  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    setLoading(true)
    fetchProducts(category.id)
  }
  
  // 跳转到商品详情
  const handleProductClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    })
  }
  
  return (
    <View className='category-page'>
      {/* 左侧分类菜单 */}
      <View className='category-sidebar'>
        <ScrollView
          scrollY
          className='category-menu'
          enableFlex
          showScrollbar={false}
        >
          {categories.map(category => (
            <View
              key={category.id}
              className={`category-menu-item ${currentCategory?.id === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              <Text className='category-menu-text'>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* 右侧商品列表 */}
      <View className='product-content'>
        {/* 分类标题 */}
        <View className='category-title'>
          <Text className='category-icon'>{currentCategory?.icon}</Text>
          <Text className='category-name'>{currentCategory?.name}</Text>
        </View>
        
        {/* 商品列表 */}
        <ScrollView
          scrollY
          className='product-list'
          enableFlex
          showScrollbar={false}
        >
          {loading ? (
            <View className='loading'>加载中...</View>
          ) : products.length > 0 ? (
            products.map(product => (
              <View
                key={product.id}
                className='product-item'
                onClick={() => handleProductClick(product.id)}
              >
                <Image className='product-image' src={product.images[0]} mode='aspectFill' />
                <View className='product-info'>
                  <Text className='product-name'>{product.name}</Text>
                  <View className='product-price-row'>
                    <Text className='product-price'>¥{product.price}</Text>
                    {product.originalPrice > product.price && (
                      <Text className='product-original'>¥{product.originalPrice}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='empty-list'>暂无商品</View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}
