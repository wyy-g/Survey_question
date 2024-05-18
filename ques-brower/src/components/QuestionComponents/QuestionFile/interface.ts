export type QuestionFilePropsType = {
	title?: string
	placeholder?: string
	isShowTitle?: boolean //是否显示标题
	isClear?: boolean //是否可以清空
	defaultValue?: string //默认值
	isShow?: boolean //是否隐藏该组件，隐藏后发布不会显示，可作为备注使用
	onChange?: (newProps: QuestionFilePropsType) => void
	isMustFill?: boolean //是否必填
	order_index?: number | string //序号
	isShowOrderIndex?: boolean // 是否显示序号
	onValueChange?: (value: string) => void //值改变执行的函数
	isShowWarning?: boolean //必填状态下是否实现未填警告
	customErrorMessage?: string
	uploadMinNum?: number
	uploadMaxNum?: number
	fileType?: string
	singleFileSize?: string
}

export const QuestionFileDefaultProps: QuestionFilePropsType = {
	title: '文件/图片上传',
	placeholder: '请输入单行文本',
	isShowTitle: true,
	isClear: true,
	defaultValue: '',
	isShow: false,
	isMustFill: true,
	isShowOrderIndex: true,
	isShowWarning: false,
	customErrorMessage: '请填写此项',
	uploadMaxNum: 1,
	uploadMinNum: 1,
	fileType: 'all',
	singleFileSize: '5',
}
