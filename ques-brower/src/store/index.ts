import { configureStore } from '@reduxjs/toolkit'
import userReducer, { UserStateType } from './userReducer'
import componentsReducer, { ComponentStateType } from './componentReducer'
import pageInfoReducer, { PageInfoType } from './pageInfoReducer'
import answerReducer, { AnswersType } from './answerReducer'

export type StateType = {
	user: UserStateType
	component: ComponentStateType
	pageInfo: PageInfoType
	answer: AnswersType
}

export default configureStore({
	reducer: {
		user: userReducer,
		component: componentsReducer,
		pageInfo: pageInfoReducer,
		answer: answerReducer,
	},
})
