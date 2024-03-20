import React, { FC, useEffect, useState } from 'react'
import { DatePicker, Typography } from 'antd'
import { QUestionDateScopeDefaultProps, QuestionDateScopePropsType } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'

const { Paragraph } = Typography
const { RangePicker } = DatePicker

const QuestionDate: FC<QuestionDateScopePropsType> = (props: QuestionDateScopePropsType) => {
	const {
		title,
		isClear,
		isShowTitle,
		isMustFill,
		order_index,
		isShowOrderIndex,
		onValueChange,
		isShowWarning,
		customErrorMessage,
		format,
	} = {
		...QUestionDateScopeDefaultProps,
		...props,
	}

	const [isShowTime, setIsShowTime] = useState(false)

	useEffect(() => {
		/* eslint-disable */
		// @ts-ignore
		if (format == 'dateTime') {
			setIsShowTime(true)
		}
	}, [format])

	function handlValueChange(date: any, dateInfo: any) {
		const dateString = `开始时间：${dateInfo[0]}，截至时间：${dateInfo[1]}`
		onValueChange && onValueChange(dateString)
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
				<RangePicker
					onChange={handlValueChange}
					picker={format}
					showTime={isShowTime}
					allowClear={isClear}
				/>
			</div>
			{isShowWarning && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QuestionDate
