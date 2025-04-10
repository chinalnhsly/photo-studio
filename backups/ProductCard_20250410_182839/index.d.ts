import type { Product } from '../../types/product'

export interface ProductCardProps {
  data: Product
  onClick?: () => void
}

declare const ProductCard: React.FC<ProductCardProps>
export default ProductCard
