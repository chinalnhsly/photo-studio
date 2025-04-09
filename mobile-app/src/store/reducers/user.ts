import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  info: {
    id?: number
    username?: string
    avatar?: string
  }
  isLoggedIn: boolean
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
    isLoggedIn: false
  } as UserState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserState['info']>) => {
      state.info = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.info = {}
      state.isLoggedIn = false
    }
  }
})

export const { setUserInfo, logout } = userSlice.actions
export default userSlice.reducer
