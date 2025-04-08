import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product } from '../../types/product'

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    // 模拟API调用
    return [] as Product[]
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [] as Product[],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload
        state.loading = false
      })
  }
})

export default productSlice.reducer
