import React, { FC, useEffect, useState } from 'react'
import { Typography, Radio, Space } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { QuestionRadioDefaultProps, QuestionRadioPropsType } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'

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
	} = {
		...QuestionRadioDefaultProps,
		...props,
	}

	const [innerValue, setInnerValue] = useState(value)

	function handleChange(e: RadioChangeEvent) {
		setInnerValue(e.target.value)
	}

	useEffect(() => {
		setInnerValue(value)
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
			<Radio.Group onChange={handleChange} value={innerValue}>
				<Space
					direction={isVertical ? 'vertical' : 'horizontal'}
					wrap
					style={{ marginLeft: '15px' }}
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
								}}
							>
								{text}
							</Radio>
						)
					})}
				</Space>
			</Radio.Group>
		</div>
	)
}

export default Component
