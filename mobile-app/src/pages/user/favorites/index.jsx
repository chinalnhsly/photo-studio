import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟收藏数据
const mockFavorites = [
  {
    id: 'fav1',
    name: '韩式婚纱摄影套餐',
    desc: '专业摄影师拍摄，多种场景可选，提供化妆、服装和精修照片',
    price: 2999,
    image: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg'
  },
  {
    id: 'fav2',
    name: '儿童写真套餐',
    desc: '专为2-10岁儿童设计，多种主题可选，提供数码照片和精美相册',
    price: 1299,
    image: 'https://img.freepik.com/free-photo/full-shot-kid-taking-photos_23-2149029007.jpg'
  },
  {
    id: 'fav3',
    name: '家庭合影套餐',
    desc: '全家福拍摄，活动期间特惠，赠送精美相框一个',
    price: 1899,
    image: 'https://img.freepik.com/free-photo/front-view-happy-family-park_23-2148929596.jpg'
  }
]

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setFavorites(mockFavorites)
      setLoading(false)
    }, 500)
  }, [])
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setSelectedItems({})
    setSelectAll(false)
  }
  
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    
    const newSelectedItems = {}
    favorites.forEach(item => {
      newSelectedItems[item.id] = newSelectAll
    })
    setSelectedItems(newSelectedItems)
  }
  
  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length
  }
  
  const handleDeleteSelected = () => {
    const selectedIds = Object.entries(selectedItems)
      .filter(([_, selected]) => selected)
      .map(([id]) => id)
    
    if (selectedIds.length === 0) {
      Taro.showToast({
        title: '请选择要删除的收藏',
        icon: 'none'
      })
      return
    }
    
    Taro.showModal({
      title: '删除收藏',
      content: '确定要删除选中的收藏吗？',
      success: function (res) {
        if (res.confirm) {
          // 模拟删除逻辑
          const newFavorites = favorites.filter(item => !selectedIds.includes(item.id))
          setFavorites(newFavorites)
          setSelectedItems({})
          
          Taro.showToast({
            title: '已删除收藏',
            icon: 'success'
          })
          
          if (newFavorites.length === 0) {
            setIsEditMode(false)
          }
        }
      }
    })
  }
  
  const navigateToDetail = (id) => {
    if (!isEditMode) {
      Taro.navigateTo({
        url: `/pages/product/detail/index?id=${id}`
      })
    }
  }
  
  const handleAddToCart = (e, id) => {
    e.stopPropagation()
    
    // 模拟加入购物车逻辑
    Taro.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  }
  
  const renderEmpty = () => (
    <View className='empty-favorites'>
      <Image className='empty-icon' src='https://img.icons8.com/clouds/100/000000/like.png' />
      <Text className='empty-text'>暂无收藏商品</Text>
      <View 
        className='shop-btn'
        onClick={() => Taro.switchTab({
          url: '/pages/home/index'
        })}
      >
        去逛逛
      </View>
    </View>
  )
  
  return (
    <View className='favorites-page'>
      <View className='header'>
        <Text className='title'>我的收藏</Text>
        {favorites.length > 0 && (
          <Text className='edit-btn' onClick={toggleEditMode}>
            {isEditMode ? '完成' : '编辑'}
          </Text>
        )}
      </View>
      
      <View className='favorites-list'>
        {loading ? (
          <View className='loading-container'>加载中...</View>
        ) : favorites.length > 0 ? (
          favorites.map(item => (
            <View 
              key={item.id} 
              className='favorites-item'
              onClick={() => navigateToDetail(item.id)}
            >
              {isEditMode && (
                <View 
                  className='checkbox'
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelectItem(item.id)
                  }}
                >
                  <View className={`checkbox-inner ${selectedItems[item.id] ? 'checked' : ''}`} />
                </View>
              )}
              
              <View className='item-content'>
                <Image className='item-image' src={item.image} mode='aspectFill' />
                <View className='item-info'>
                  <Text className='item-name'>{item.name}</Text>
                  <Text className='item-desc'>{item.desc}</Text>
                  <View className='item-price-row'>
                    <Text className='item-price'>¥{item.price}</Text>
                    {!isEditMode && (
                      <View 
                        className='add-cart-btn'
                        onClick={(e) => handleAddToCart(e, item.id)}
                      >
                        +
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          renderEmpty()
        )}
      </View>
      
      {isEditMode && favorites.length > 0 && (
        <View className='action-bar'>
          <View 
            className='select-all'
            onClick={toggleSelectAll}
          >
            <View className='checkbox-wrapper'>
              <View className={`checkbox ${selectAll ? 'checked' : ''}`} />
            </View>
            <Text className='select-text'>全选</Text>
          </View>
          
          <View className='action-buttons'>
            <View 
              className='action-btn delete'
              onClick={handleDeleteSelected}
            >
              删除({getSelectedCount()})
            </View>
            
            <View className='action-btn add-cart'>
              加入购物车
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default FavoritesPage
