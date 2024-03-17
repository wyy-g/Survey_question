import React, { FC } from 'react'
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

	function handlValueChange(value: number) {
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
			{isShowWarning && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QuestionMark
