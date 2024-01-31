import React, { FC } from 'react'
import { Typography, Radio, Space } from 'antd'
import { QuestionRadioDefaultProps, QuestionRadioPropsType } from './interface'
import IconFont from '../../../utools/IconFont'

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
	} = {
		...QuestionRadioDefaultProps,
		...props,
	}
	return (
		<div>
			<div>
				{isShowTitle && (
					<Paragraph strong>
						{isMustFill && <IconFont type="icon-bitian" />}
						<span style={{ marginLeft: '2px' }}>{title}</span>
					</Paragraph>
				)}
			</div>
			<Radio.Group value={value}>
				<Space direction={isVertical ? 'vertical' : 'horizontal'} wrap>
					{options.map(opt => {
						const { value, text } = opt
						return (
							<Radio
								key={value}
								value={value}
								style={{ borderRadius: '8px', border: '1px solid #dcdfe6', padding: '5px 12px' }}
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
