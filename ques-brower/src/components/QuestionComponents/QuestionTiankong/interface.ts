export type QuestionTiankongPropsType = {
	title?: string
	isShowTitle?: boolean
	isShow?: boolean
	isMustFill?: boolean
	content?: string
	onChange?: (newProps: QuestionTiankongPropsType) => void
}

export const QuestionTiankongDefaultProps: QuestionTiankongPropsType = {
	title: '多项填空',
	isMustFill: true,
	isShowTitle: true,
	isShow: false,
	content: '请输入多项填空内容',
}
