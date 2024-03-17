import React, { FC, useState } from 'react'
import { Typography, Input } from 'antd'
import { QuestionTextareaPropsType, QuestionTextareaDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'

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
		isShowWarning,
		customErrorMessage,
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
			<div style={{ marginLeft: '15px', marginBottom: '10px' }}>
				<TextArea
					placeholder={placeholder}
					allowClear={isClear}
					value={textareaValue}
					onChange={e => setTextareaValue(e.target.value)}
					onBlur={handlValueChange}
				/>
			</div>
			{isShowWarning && !textareaValue && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QuestionTextarea
