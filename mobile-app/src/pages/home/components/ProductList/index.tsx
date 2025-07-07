import { View } from '@tarojs/components'
import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProducts } from '@/store/reducers/product'
import { ProductCard } from '@/components'
import type { BaseProduct } from '@/types/product'
import './index.scss'

const ProductList = () => {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector(state => state.product)

  useEffect(() => {
    void dispatch(fetchProducts({ page: 1, pageSize: 10 }))
  }, [dispatch])

  const handleProductClick = useCallback((product: BaseProduct) => () => {
    console.log('clicked product:', product.id)
  }, [])

  if (loading) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='product-list'>
      <View className='grid'>
        {products.map((product: BaseProduct) => (
          <ProductCard 
            key={product.id} 
            data={product}
            onClick={handleProductClick(product)} 
          />
        ))}
      </View>
    </View>
  )
}

export default ProductList
