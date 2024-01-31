import { configureStore } from '@reduxjs/toolkit'
import userReducer, { UserStateType } from './userReducer'
import componentsReducer, { ComponentStateType } from './componentReducer'
import pageInfoReducer, { PageInfoType } from './pageInfoReducer'

export type StateType = {
	user: UserStateType
	component: ComponentStateType
	pageInfo: PageInfoType
}

export default configureStore({
	reducer: {
		user: userReducer,
		component: componentsReducer,
		pageInfo: pageInfoReducer,
	},
})
