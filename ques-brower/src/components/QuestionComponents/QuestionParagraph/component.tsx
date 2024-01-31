import React, { FC } from 'react'
import { Typography } from 'antd'
import { QuestionParagraphProps, QuestionParagraphDefaultProps } from './interface'

const { Paragraph } = Typography

const Component: FC<QuestionParagraphProps> = (props: QuestionParagraphProps) => {
	const { text = '' } = { ...QuestionParagraphDefaultProps, ...props }

	const textList = text.split('\n')

	return (
		<Paragraph style={{ margin: '0 6px' }}>
			{textList.map((t, index) => (
				<span key={index}>
					{index > 0 && <br />}
					{t}
				</span>
			))}
		</Paragraph>
	)
}

export default Component
