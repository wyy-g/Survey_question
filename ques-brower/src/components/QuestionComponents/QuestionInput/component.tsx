import React, { FC } from 'react'
import { Typography, Input } from 'antd'
import { QuestionInputPropsType, QuestionInputDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'

const { Paragraph } = Typography

const QuestionInput: FC<QuestionInputPropsType> = (props: QuestionInputPropsType) => {
	const { title, placeholder, isClear, isShowTitle, isMustFill, order_index, isShowOrderIndex } = {
		...QuestionInputDefaultProps,
		...props,
	}
	return (
		<div>
			<div>
				{isShowTitle && (
					<Paragraph strong style={{ fontSize: '16px' }}>
						{isMustFill && <IconFont type="icon-bitian" />}
						{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}
						<span style={{ marginLeft: '2px' }}>{title}</span>
					</Paragraph>
				)}
			</div>
			<div style={{ marginLeft: '15px' }}>
				<Input placeholder={placeholder} allowClear={isClear}></Input>
			</div>
		</div>
	)
}

export default QuestionInput
