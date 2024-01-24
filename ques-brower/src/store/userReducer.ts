import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserStateType = {
	username: string
	nickname?: string
	headImg?: string
}

const INIT_STATE: UserStateType = { username: '', nickname: '', headImg: '' }

export const userSlice = createSlice({
	name: 'user',
	initialState: INIT_STATE,
	reducers: {
		loginReducer: (state: UserStateType, action: PayloadAction<UserStateType>) => {
			return action.payload
		},
		logoutReducer: () => {
			return INIT_STATE
		},
	},
})

export const { loginReducer, logoutReducer } = userSlice.actions
export default userSlice.reducer
