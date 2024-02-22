import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'

export type PageInfoType = {
	title: string
	description?: string
	isShowOrderIndex?: boolean
	isPublished?: boolean
	createdAt?: string
	updatedAt?: string
}

const INIT_STATE: PageInfoType = {
	title: '',
	description: '',
	isShowOrderIndex: true,
	isPublished: false,
	createdAt: '',
	updatedAt: '',
}

const pageInfoSlice = createSlice({
	name: 'pageInfo',
	initialState: INIT_STATE,
	reducers: {
		resetPageInfo: (state: PageInfoType, action: PayloadAction<PageInfoType>) => {
			return action.payload
		},
		// 修改标题
		changePageTitle: produce((draft: PageInfoType, action: PayloadAction<string>) => {
			draft.title = action.payload
		}),
		// 修改发布状态
		changePageIsPushlished: produce((draft: PageInfoType, action: PayloadAction<boolean>) => {
			draft.isPublished = action.payload
		}),
	},
})

export const { resetPageInfo, changePageTitle, changePageIsPushlished } = pageInfoSlice.actions
export default pageInfoSlice.reducer
