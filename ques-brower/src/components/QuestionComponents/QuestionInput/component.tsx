import React, { FC, useState } from 'react'
import { Typography, Input } from 'antd'
import { QuestionInputPropsType, QuestionInputDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'

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
		isShowWarning,
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
			<div style={{ marginLeft: '15px', marginBottom: '10px' }}>
				<Input
					placeholder={placeholder}
					allowClear={isClear}
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					onBlur={handlValueChange}
				></Input>
			</div>
			{isShowWarning && !inputValue && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					请填写此项
				</span>
			)}
		</div>
	)
}

export default QuestionInput
