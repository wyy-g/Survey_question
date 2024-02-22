import React, { FC } from 'react'
import { Typography } from 'antd'
import { QuestionTitlePropsType, QuestionTitleDefaultProps } from './interface'
import addZero from '../../../utools/addZero'

const { Title } = Typography

const QuestionTitle: FC<QuestionTitlePropsType> = (props: QuestionTitlePropsType) => {
	const {
		text = '',
		level = 1,
		isCenter = false,
		isShowOrderIndex,
		order_index,
	} = { ...QuestionTitleDefaultProps, ...props }

	const genFontSize = (level: number) => {
		switch (level) {
			case 1:
				return '24px'
			case 2:
				return '20px'
			case 3:
				return '16px'
			default:
				return '16px'
		}
	}

	return (
		<Title
			level={level}
			style={{
				textAlign: isCenter ? 'center' : 'start',
				marginBottom: 0,
				fontSize: genFontSize(level),
				marginLeft: '15px',
			}}
		>
			{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}

			{text}
		</Title>
	)
}

export default QuestionTitle
