export type QuestionParagraphProps = {
	text?: string
	onChange?: (newProps: QuestionParagraphProps) => void
	isShow?: boolean
	order_index?: number | string
	isShowOrderIndex?: boolean
}

export const QuestionParagraphDefaultProps: QuestionParagraphProps = {
	text: '请输入描述',
	isShow: false,
	isShowOrderIndex: true,
}
