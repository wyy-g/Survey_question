export type OptionType = {
	value: string
	text: string
}
export type QuestionRadioPropsType = {
	title?: string
	isVertical?: boolean
	options?: OptionType[]
	value?: string
	isShowTitle?: boolean
	isMustFill?: boolean
	isShow?: boolean
	// 用于PropComponent
	onChange?: (newProps: QuestionRadioPropsType) => void
	order_index?: number | string
	isShowOrderIndex?: boolean
	onValueChange?: (value: string) => void
	isShowWarning?: boolean
	customErrorMessage?: string
}

export const QuestionRadioDefaultProps: QuestionRadioPropsType = {
	title: '单选标题',
	isVertical: false,
	isShowTitle: true,
	isMustFill: true,
	isShow: false,
	options: [
		{ value: 'item1', text: '选项一' },
		{ value: 'item2', text: '选项二' },
		{ value: 'item3', text: '选项三' },
	],
	value: '',
	isShowOrderIndex: true,
	isShowWarning: false,
	customErrorMessage: '请选择一个',
}
