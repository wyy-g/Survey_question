export type QuestionTitlePropsType = {
	text?: string
	level?: 1 | 2 | 3
	isCenter?: boolean
	onChange?: (newProps: QuestionTitlePropsType) => void
	isShow?: boolean
	order_index?: number | string
	isShowOrderIndex?: boolean
}

export const QuestionTitleDefaultProps: QuestionTitlePropsType = {
	text: '问卷标题',
	level: 1,
	isCenter: false,
	isShow: false,
	isShowOrderIndex: true,
}
