import React, { FC, useState } from 'react'
import { Rate, Typography } from 'antd'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import { QuestionMarkDefaultProps, QuestionMarkPropsType } from './interface'
import styles from '../common.module.scss'

const { Paragraph } = Typography

const QuestionMark: FC<QuestionMarkPropsType> = (props: QuestionMarkPropsType) => {
	const {
		title,
		isShowTitle,
		isMustFill,
		order_index,
		isShowOrderIndex,
		onValueChange,
		isShowWarning,
		customErrorMessage,
		maxCount,
		allowHalf,
		customIcon,
	} = {
		...QuestionMarkDefaultProps,
		...props,
	}

	// 存储值用来判断显示警告后重写填写警告消失
	const [markValue, setMarkValue] = useState(0)

	function handlValueChange(value: number) {
		setMarkValue(value)
		onValueChange && onValueChange(value)
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
				{' '}
				<Rate
					allowHalf={allowHalf}
					count={Number(maxCount)}
					character={<IconFont type={customIcon!} />}
					style={{ fontSize: 36, color: 'red' }}
					onChange={handlValueChange}
				/>
			</div>
			{isShowWarning && markValue === 0 && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QuestionMark
