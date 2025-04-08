import { View, Text, Image } from '@tarojs/components'
import type { Product } from '@/types/business'
import './index.scss'

export interface ProductCardProps {
  data: Product
  onClick?: () => void
}

const ProductCard = ({ data, onClick }: ProductCardProps) => {
  return (
    <View className='product-card' onClick={onClick}>
      <Image className='product-image' src={data.images[0]} mode='aspectFill' />
      <View className='product-info'>
        <Text className='product-name'>{data.name}</Text>
        <View className='product-price'>
          <Text className='price'>¥{data.price}</Text>
          {data.originalPrice && (
            <Text className='original-price'>¥{data.originalPrice}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default ProductCard
