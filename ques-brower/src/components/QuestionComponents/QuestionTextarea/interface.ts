export type QuestionTextareaPropsType = {
	title?: string
	placeholder?: string
	onChange?: (newProps: QuestionTextareaPropsType) => void
	isShowTitle?: boolean
	isClear?: boolean
	defaultValue?: string
	isShow?: boolean
	isMustFill?: boolean
	order_index?: number | string
	isShowOrderIndex?: boolean
	onValueChange?: (value: string) => void
}

export const QuestionTextareaDefaultProps: QuestionTextareaPropsType = {
	title: '多行输入框',
	placeholder: '请输入',
	isShowTitle: true,
	isClear: true,
	defaultValue: '',
	isShow: false,
	isMustFill: true,
	isShowOrderIndex: true,
}
