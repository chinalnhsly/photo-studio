import React from 'react'
import { View, Text } from '@tarojs/components'
import type { CategoryGridProps } from './types'
import './index.scss'

interface CategoryItemProps {
  title: string
  icon?: string
  onClick?: () => void
}

const CategoryItem: React.FC<CategoryItemProps> = ({ title, onClick }) => (
  <View className='category-item' onClick={onClick}>
    <Text className='category-title'>{title}</Text>
  </View>
)

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories = [], className = '' }) => {
  const defaultCategories = [
    { id: 1, title: '婚纱摄影' },
    { id: 2, title: '写真' },
    { id: 3, title: '亲子照' }
  ]

  const items = categories.length > 0 ? categories : defaultCategories

  return (
    <View className={`category-grid ${className}`}>
      {items.map(category => (
        <CategoryItem 
          key={category.id}
          title={category.title}
        />
      ))}
    </View>
  )
}

export default CategoryGrid
