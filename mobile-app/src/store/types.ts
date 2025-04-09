import {  AnyAction } from '@reduxjs/toolkit'
import { ThunkDispatch } from 'redux-thunk'
import type { Product } from '../types/business'

export interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  hasMore: boolean
  total: number
  currentPage: number
}

export interface RootState {
  product: ProductState
}

export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>
export type AppDispatch = AppThunkDispatch
