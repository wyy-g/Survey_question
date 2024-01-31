import React, { FC } from 'react'
import { Typography, Input } from 'antd'
import { QuestionInputPropsType, QuestionInputDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'

const { Paragraph } = Typography

const QuestionInput: FC<QuestionInputPropsType> = (props: QuestionInputPropsType) => {
	const { title, placeholder, isClear, isShowTitle, isMustFill } = {
		...QuestionInputDefaultProps,
		...props,
	}
	return (
		<div>
			<div>
				{isShowTitle && (
					<Paragraph strong>
						{isMustFill && <IconFont type="icon-bitian" />}
						<span style={{ marginLeft: '2px' }}>{title}</span>
					</Paragraph>
				)}
			</div>
			<div style={{ margin: '0 6px' }}>
				<Input placeholder={placeholder} allowClear={isClear}></Input>
			</div>
		</div>
	)
}

export default QuestionInput
