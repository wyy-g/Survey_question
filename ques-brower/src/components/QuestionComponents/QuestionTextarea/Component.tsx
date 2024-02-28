import React, { FC, useState } from 'react'
import { Typography, Input } from 'antd'
import { QuestionTextareaPropsType, QuestionTextareaDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'

const { Paragraph } = Typography
const { TextArea } = Input

const QuestionTextarea: FC<QuestionTextareaPropsType> = (props: QuestionTextareaPropsType) => {
	const [textareaValue, setTextareaValue] = useState(props.defaultValue || '')

	const {
		title,
		placeholder,
		isClear,
		isShowTitle,
		isMustFill,
		order_index,
		isShowOrderIndex,
		onValueChange,
	} = {
		...QuestionTextareaDefaultProps,
		...props,
	}

	function handlValueChange(e: any) {
		onValueChange && onValueChange(e.target.value)
	}

	return (
		<div>
			{isShowTitle && (
				<Paragraph strong style={{ fontSize: '16px' }}>
					{isMustFill && <IconFont type="icon-bitian" />}
					{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}
					<span style={{ marginLeft: '2px' }}>{title}</span>
				</Paragraph>
			)}
			<div style={{ marginLeft: '15px' }}>
				<TextArea
					placeholder={placeholder}
					allowClear={isClear}
					value={textareaValue}
					onChange={e => setTextareaValue(e.target.value)}
					onBlur={handlValueChange}
				/>
			</div>
		</div>
	)
}

export default QuestionTextarea
