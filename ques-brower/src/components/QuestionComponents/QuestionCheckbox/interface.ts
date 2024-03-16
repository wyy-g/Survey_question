export type OptionType = {
	value: string
	text: string
	checked: boolean
}
export type QuestionCheckboxPropsType = {
	title?: string
	isVertical?: boolean
	list?: OptionType[]
	isShowTitle?: boolean
	isMustFill?: boolean
	isShow?: boolean
	// 用于PropComponent
	onChange?: (newProps: QuestionCheckboxPropsType) => void
	order_index?: number | string
	isShowOrderIndex?: boolean
	onValueChange?: (value: string) => void
	isShowWarning?: boolean
}

export const QuestionCheckboxDefaultProps: QuestionCheckboxPropsType = {
	title: '多选标题',
	isVertical: false,
	list: [
		{ value: 'item1', text: '选项一', checked: false },
		{ value: 'item2', text: '选项二', checked: false },
		{ value: 'item3', text: '选项三', checked: false },
	],
	isShowTitle: true,
	isMustFill: true,
	isShow: false,
	isShowOrderIndex: true,
	isShowWarning: false,
}
