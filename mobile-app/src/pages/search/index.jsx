import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = () => {
    if (!keyword.trim()) return
    
    setSearching(true)
    
    // 模拟搜索请求
    setTimeout(() => {
      // 模拟数据
      const results = Array(5).fill().map((_, i) => ({
        id: `prod-${i}`,
        name: `${keyword}相关商品 ${i+1}`,
        price: Math.floor(Math.random() * 1000) + 100,
      }))
      
      setSearchResults(results)
      setSearching(false)
    }, 800)
  }

  return (
    <View className='search-page'>
      <View className='search-bar'>
        <Input
          className='search-input'
          value={keyword}
          onInput={e => setKeyword(e.detail.value)}
          placeholder='搜索商品'
          confirmType='search'
          onConfirm={handleSearch}
        />
        <View className='search-btn' onClick={handleSearch}>搜索</View>
      </View>
      
      <View className='search-results'>
        {searching ? (
          <View className='loading'>正在搜索...</View>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <View className='result-list'>
                {searchResults.map(item => (
                  <View 
                    key={item.id}
                    className='result-item'
                    onClick={() => Taro.navigateTo({
                      url: `/pages/product/detail/index?id=${item.id}`
                    })}
                  >
                    <Text className='item-name'>{item.name}</Text>
                    <Text className='item-price'>¥{item.price}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className='empty-result'>
                {keyword ? '没有找到相关商品' : '请输入关键词搜索'}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  )
}

export default SearchPage
