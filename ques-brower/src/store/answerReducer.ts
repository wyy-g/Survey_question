import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'

export type AnswersType = {
	respondentId?: string | number
	surveyId?: string | number
	answer_value?: string
	option_values?: string
	image_signature_url?: string
	image_upload_url?: string
	score_value?: string
	device_info?: string
	browser_info?: string
	ip_address?: string
	start_time?: string
	submit_time?: string
}

const INIT_STATE: AnswersType = {
	respondentId: '',
	surveyId: '',
	answer_value: '',
	option_values: '',
	image_signature_url: '',
	image_upload_url: '',
	score_value: '',
	device_info: '',
	browser_info: '',
	ip_address: '',
	start_time: '',
	submit_time: '',
}

const answersSlice = createSlice({
	name: 'answers',
	initialState: INIT_STATE,
	reducers: {
		resetAnswers: (state: AnswersType, action: PayloadAction<AnswersType>) => {
			return action.payload
		},
	},
})

export const { resetAnswers } = answersSlice.actions

export default answersSlice.reducer
