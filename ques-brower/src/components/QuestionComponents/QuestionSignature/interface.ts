export type QuestionSingaturePropsType = {
	title?: string
	placeholder?: string
	isShowTitle?: boolean //是否显示标题
	isShow?: boolean //是否隐藏该组件，隐藏后发布不会显示，可作为备注使用
	onChange?: (newProps: QuestionSingaturePropsType) => void //属性值改变传给父组件
	isMustFill?: boolean //是否必填
	order_index?: number | string //序号
	isShowOrderIndex?: boolean // 是否显示序号
	onValueChange?: (value: string) => void //值改变执行的函数
	isShowWarning?: boolean //必填状态下是否实现未填警告
	color?: any //签名得颜色
}

export const QuestionSignatureDefaultProps: QuestionSingaturePropsType = {
	title: '电子签名',
	placeholder: '签名区域',
	isShowTitle: true,
	isShow: false,
	isMustFill: true,
	isShowOrderIndex: true,
	isShowWarning: false,
	color: '#000000 ',
}
