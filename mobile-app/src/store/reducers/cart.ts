import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalAmount: number
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0
  } as CartState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload)
      state.totalAmount += action.payload.price * action.payload.quantity
    }
  }
})

export const { addToCart } = cartSlice.actions
export default cartSlice.reducer
