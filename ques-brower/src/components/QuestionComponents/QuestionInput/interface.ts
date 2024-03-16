export type QuestionInputPropsType = {
	title?: string
	placeholder?: string
	isShowTitle?: boolean //是否显示标题
	isClear?: boolean //是否可以清空
	defaultValue?: string //默认值
	isShow?: boolean //是否隐藏该组件，隐藏后发布不会显示，可作为备注使用
	onChange?: (newProps: QuestionInputPropsType) => void
	isMustFill?: boolean //是否必填
	order_index?: number | string //序号
	isShowOrderIndex?: boolean // 是否显示序号
	onValueChange?: (value: string) => void //值改变执行的函数
	isShowWarning?: boolean //必填状态下是否实现未填警告
}

export const QuestionInputDefaultProps: QuestionInputPropsType = {
	title: '单行输入框',
	placeholder: '请输入单行文本',
	isShowTitle: true,
	isClear: true,
	defaultValue: '',
	isShow: false,
	isMustFill: true,
	isShowOrderIndex: true,
	isShowWarning: false,
}
