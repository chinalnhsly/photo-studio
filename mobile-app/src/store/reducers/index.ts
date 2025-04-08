import { combineReducers } from '@reduxjs/toolkit'
import productReducer from './product'
import cartReducer from './cart'
import userReducer from './user'

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
