export type QuestionParagraphProps = {
	text?: string
	onChange?: (newProps: QuestionParagraphProps) => void
}

export const QuestionParagraphDefaultProps: QuestionParagraphProps = {
	text: '请输入描述',
}
