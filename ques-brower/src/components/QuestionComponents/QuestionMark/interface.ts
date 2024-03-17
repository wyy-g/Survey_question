export type QuestionMarkIcon =
	| 'icon-star'
	| 'icon-shouye'
	| 'icon-haopingxiaolian'
	| 'icon-zantong'
	| 'icon-aixin'

export type QuestionMarkPropsType = {
	title?: string
	noMarks?: string //零分描述
	fillMarks?: string //满分描述
	isShowTitle?: boolean //是否显示标题
	defaultValue?: string //默认值
	isShow?: boolean //是否隐藏该组件，隐藏后发布不会显示，可作为备注使用
	onChange?: (newProps: QuestionMarkPropsType) => void //属性改变
	isMustFill?: boolean //是否必填
	order_index?: number | string //序号
	isShowOrderIndex?: boolean // 是否显示序号
	onValueChange?: (value: any) => void //值改变执行的函数
	isShowWarning?: boolean //必填状态下是否实现未填警告
	customErrorMessage?: string //自定义提示
	maxCount?: number //最大分值
	allowHalf?: boolean //是否允许半分
	customIcon?: QuestionMarkIcon
}

export const QuestionMarkDefaultProps: QuestionMarkPropsType = {
	title: '评分',
	noMarks: '很不满意',
	fillMarks: '非常满意',
	isShowTitle: true,
	defaultValue: '',
	isShow: false,
	isMustFill: true,
	isShowOrderIndex: true,
	isShowWarning: false,
	customErrorMessage: '请填写此项',
	maxCount: 5,
	allowHalf: false,
	customIcon: 'icon-star',
}
