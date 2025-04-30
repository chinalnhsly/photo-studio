import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductReviews, getUserReviews } from '../services/review';

// 获取商品评价列表
export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  async ({ productId, params }: { productId: number; params: any }, { rejectWithValue }) => {
    try {
      const response = await getProductReviews(productId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 获取用户评价列表
export const fetchUserReviews = createAsyncThunk(
  'review/fetchUserReviews',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await getUserReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 评价状态管理
const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    productReviews: {
      items: [],
      stats: null,
      loading: false,
      error: null,
      hasMore: true,
      page: 1
    },
    userReviews: {
      items: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 1
    }
  },
  reducers: {
    resetProductReviews: (state) => {
      state.productReviews = {
        items: [],
        stats: null,
        loading: false,
        error: null,
        hasMore: true,
        page: 1
      };
    },
    resetUserReviews: (state) => {
      state.userReviews = {
        items: [],
        loading: false,
        error: null,
        hasMore: true,
        page: 1
      };
    }
  },
  extraReducers: (builder) => {
    // 处理获取商品评价
    builder
      .addCase(fetchProductReviews.pending, (state, action) => {
        // 只有在第一页加载时才显示全局loading
        const { params } = action.meta.arg;
        if (params.page === 1) {
          state.productReviews.loading = true;
        }
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        const { params } = action.meta.arg;
        const { reviews, stats } = action.payload;
        
        if (params.page === 1) {
          // 加载第一页，替换现有数据
          state.productReviews.items = reviews;
          state.productReviews.stats = stats;
          state.productReviews.page = 1;
        } else {
          // 加载更多，追加数据
          state.productReviews.items = [...state.productReviews.items, ...reviews];
          state.productReviews.page = params.page;
        }
        
        // 判断是否还有更多数据
        state.productReviews.hasMore = reviews.length === params.limit;
        state.productReviews.loading = false;
        state.productReviews.error = null;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.productReviews.loading = false;
        state.productReviews.error = action.payload || '加载失败';
      })
      
      // 处理获取用户评价
      .addCase(fetchUserReviews.pending, (state, action) => {
        // 只有在第一页加载时才显示全局loading
        const { page = 1 } = action.meta.arg;
        if (page === 1) {
          state.userReviews.loading = true;
        }
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        const { page = 1 } = action.meta.arg;
        const reviews = action.payload;
        
        if (page === 1) {
          // 加载第一页，替换现有数据
          state.userReviews.items = reviews;
          state.userReviews.page = 1;
        } else {
          // 加载更多，追加数据
          state.userReviews.items = [...state.userReviews.items, ...reviews];
          state.userReviews.page = page;
        }
        
        // 判断是否还有更多数据
        state.userReviews.hasMore = reviews.length === (action.meta.arg.limit || 10);
        state.userReviews.loading = false;
        state.userReviews.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviews.loading = false;
        state.userReviews.error = action.payload || '加载失败';
      });
  }
});

export const { resetProductReviews, resetUserReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
