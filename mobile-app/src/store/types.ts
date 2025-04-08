import {  AnyAction } from '@reduxjs/toolkit'
import { ThunkDispatch } from 'redux-thunk'
import type { Product } from '../types/product'

export interface RootState {
  product: {
    products: Product[]
    loading: boolean
    error: string | null
  }
}

export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>
export type AppDispatch = AppThunkDispatch
