import { configureStore } from '@reduxjs/toolkit'
import userReducer, { UserStateType } from './userReducer'
import componentsReducer, { ComponentStateType } from './componentReducer'

export type StateType = {
	user: UserStateType
	component: ComponentStateType
}

export default configureStore({
	reducer: {
		user: userReducer,
		component: componentsReducer,
	},
})
