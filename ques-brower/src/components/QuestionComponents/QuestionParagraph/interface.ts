export type QuestionParagraphProps = {
	text?: string
	onChange?: (newProps: QuestionParagraphProps) => void
	isShow?: boolean
}

export const QuestionParagraphDefaultProps: QuestionParagraphProps = {
	text: '请输入描述',
	isShow: false,
}
