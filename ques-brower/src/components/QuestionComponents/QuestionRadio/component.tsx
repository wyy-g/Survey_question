import React, { FC, useEffect, useState } from 'react'
import { Typography, Radio, Space } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { QuestionRadioDefaultProps, QuestionRadioPropsType } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'

const { Paragraph } = Typography

const Component: FC<QuestionRadioPropsType> = (props: QuestionRadioPropsType) => {
	const {
		title,
		value,
		isShowTitle,
		isMustFill,
		isShow,
		options = [],
		isVertical,
		order_index,
		isShowOrderIndex,
		onValueChange,
		isShowWarning,
	} = {
		...QuestionRadioDefaultProps,
		...props,
	}

	const [innerValue, setInnerValue] = useState(value)

	function handleChange(e: RadioChangeEvent) {
		setInnerValue(e.target.value)
		const selectText = options.find(item => item.value === e.target.value)
		onValueChange && onValueChange(selectText!.text)
	}

	useEffect(() => {
		setInnerValue(value)
		if (value) {
			const selectText = options.find(item => item.value === value)
			onValueChange && onValueChange(selectText!.text)
		}
	}, [value])

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
			<div>
				<Radio.Group onChange={handleChange} value={innerValue}>
					<Space
						direction={isVertical ? 'vertical' : 'horizontal'}
						wrap
						style={{ marginLeft: '15px', marginBottom: '10px' }}
					>
						{options.map(opt => {
							const { value, text } = opt
							return (
								<Radio
									key={value}
									value={value}
									style={{
										borderRadius: '8px',
										border: '1px solid #dcdfe6',
										padding: '5px 12px',
										minWidth: '150px',
										marginRight: '3px',
									}}
								>
									{text}
								</Radio>
							)
						})}
					</Space>
				</Radio.Group>
			</div>

			{isShowWarning && !innerValue && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					请填写此项
				</span>
			)}
		</div>
	)
}

export default Component
