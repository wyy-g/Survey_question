import React, { FC } from 'react'
import { Typography, Input } from 'antd'
import { QuestionTextareaPropsType, QuestionTextareaDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'

const { Paragraph } = Typography
const { TextArea } = Input

const QuestionTextarea: FC<QuestionTextareaPropsType> = (props: QuestionTextareaPropsType) => {
	const { title, placeholder, isClear, isShowTitle, isMustFill } = {
		...QuestionTextareaDefaultProps,
		...props,
	}
	return (
		<div>
			{isShowTitle && (
				<Paragraph strong>
					{isMustFill && <IconFont type="icon-bitian" />}
					<span style={{ marginLeft: '2px' }}>{title}</span>
				</Paragraph>
			)}
			<div style={{ margin: '0 6px' }}>
				<TextArea placeholder={placeholder} allowClear={isClear} />
			</div>
		</div>
	)
}

export default QuestionTextarea
