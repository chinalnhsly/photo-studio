import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
// 改用相对路径导入，不使用别名
import { ProductCard } from '../../../components'
import './index.scss'

const ProductList = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('default')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [filter])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const newProducts = Array(10).fill().map((_, i) => ({
          id: `prod-${page}-${i}`,
          name: `商品 ${page}-${i+1}`,
          price: Math.floor(Math.random() * 1000) + 100,
          image: `https://picsum.photos/300/300?random=${page}${i}`,
          category: '摄影',
          sales: Math.floor(Math.random() * 100)
        }))
        
        if (page === 1) {
          setProducts(newProducts)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }
        
        setHasMore(page < 3) // 模拟只有3页数据
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('获取商品列表失败:', error)
      setLoading(false)
    }
  }
  
  const handleFilterChange = (newFilter) => {
    if (filter === newFilter) return
    setFilter(newFilter)
    setPage(1)
  }
  
  const handleLoadMore = () => {
    if (!hasMore || loading) return
    setPage(prev => prev + 1)
    fetchProducts()
  }
  
  const handleProductClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    })
  }
  
  return (
    <View className='product-list-page'>
      {/* 筛选栏 */}
      <View className='filter-bar'>
        <View 
          className={`filter-item ${filter === 'default' ? 'active' : ''}`}
          onClick={() => handleFilterChange('default')}
        >
          默认排序
        </View>
        <View 
          className={`filter-item ${filter === 'sales' ? 'active' : ''}`}
          onClick={() => handleFilterChange('sales')}
        >
          销量优先
        </View>
        <View 
          className={`filter-item ${filter === 'price' ? 'active' : ''}`}
          onClick={() => handleFilterChange('price')}
        >
          价格
          <Text className='filter-icon'>↑↓</Text>
        </View>
      </View>
      
      {/* 商品列表 */}
      <ScrollView
        className='product-scroll'
        scrollY
        onScrollToLower={handleLoadMore}
      >
        {products.length > 0 ? (
          <View className='product-grid'>
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </View>
        ) : (
          <View className='empty-list'>
            <Image className='empty-image' src='https://img.icons8.com/clouds/100/000000/box.png' />
            <Text className='empty-text'>暂无商品</Text>
          </View>
        )}
        
        {hasMore && (
          <View className='loading-status'>
            {loading ? '加载中...' : '上拉加载更多'}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default ProductList
