import { combineReducers } from '@reduxjs/toolkit'
import productReducer from './product'
import cartReducer from './cart'
import userReducer from './user'

const rootReducer = combineReducers({
  // 这里添加你的reducers
  product: productReducer,
  cart: cartReducer,
  user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
