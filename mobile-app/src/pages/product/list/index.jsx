import { View } from '@tarojs/components'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProducts } from '@/store/reducers/product'
import { ProductCard } from '@/components'
import type { Product } from '@/types/business'
import './index.scss'

const ProductList = () => {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector(state => state.product)

  useEffect(() => {
    void dispatch(fetchProducts({ page: 1, pageSize: 10 }))
  }, [dispatch])

  if (loading) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='product-list'>
      <View className='grid'>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            data={product as Product} 
          />
        ))}
      </View>
    </View>
  )
}

export default ProductList
