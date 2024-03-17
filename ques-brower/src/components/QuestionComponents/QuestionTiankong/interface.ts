export type QuestionTiankongPropsType = {
	title?: string
	isShowTitle?: boolean
	isShow?: boolean
	isMustFill?: boolean
	content?: string
	onChange?: (newProps: QuestionTiankongPropsType) => void
	order_index?: number | string
	isShowOrderIndex?: boolean
	onValueChange?: (value: string) => void
	isShowWarning?: boolean //必填状态下是否实现未填警告
	customErrorMessage?: string
}

export const QuestionTiankongDefaultProps: QuestionTiankongPropsType = {
	title: '多项填空',
	isMustFill: true,
	isShowTitle: true,
	isShow: false,
	content: '请输入多项填空内容',
	isShowOrderIndex: true,
	isShowWarning: false,
	customErrorMessage: '请填写此项',
}
