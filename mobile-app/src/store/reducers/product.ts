import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product } from '@/types/product'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  hasMore: boolean
  total: number
  currentPage: number
}

interface FetchProductsParams {
  page?: number
  pageSize?: number
  category?: string
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  hasMore: true,
  total: 0,
  currentPage: 1
}

// 定义获取产品的异步action，添加参数类型
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: FetchProductsParams = { page: 1, pageSize: 10 }) => {
    // 模拟API调用
    const { page = 1, pageSize = 10 } = params
    const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`)
    const data = await response.json()
    return {
      items: data.items || [],
      total: data.total || 0,
      hasMore: data.hasMore || false
    }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.items
        state.total = action.payload.total
        state.hasMore = action.payload.hasMore
        state.currentPage = state.currentPage + 1
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
  }
})

export default productSlice.reducer
