import React, { FC, useState } from 'react'
import { Typography, Input } from 'antd'
import { QuestionInputPropsType, QuestionInputDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'

const { Paragraph } = Typography

const QuestionInput: FC<QuestionInputPropsType> = (props: QuestionInputPropsType) => {
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
		...QuestionInputDefaultProps,
		...props,
	}
	const [inputValue, setInputValue] = useState(props.defaultValue || '')

	function handlValueChange(e: any) {
		onValueChange && onValueChange(e.target.value)
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
				<Input
					placeholder={placeholder}
					allowClear={isClear}
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					onBlur={handlValueChange}
				></Input>
			</div>
		</div>
	)
}

export default QuestionInput
