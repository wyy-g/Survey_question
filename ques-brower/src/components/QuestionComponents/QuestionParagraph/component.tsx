import React, { FC } from 'react'
import { Typography } from 'antd'
import { QuestionParagraphProps, QuestionParagraphDefaultProps } from './interface'
import addZero from '../../../utools/addZero'

const { Paragraph } = Typography

const Component: FC<QuestionParagraphProps> = (props: QuestionParagraphProps) => {
	const {
		text = '',
		isShowOrderIndex,
		order_index,
	} = { ...QuestionParagraphDefaultProps, ...props }

	const textList = text.split('\n')

	return (
		<Paragraph style={{ marginLeft: '15px' }}>
			{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}
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
