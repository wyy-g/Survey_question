import React, { FC } from 'react'
import { Typography, Space, Checkbox } from 'antd'
import { QuestionCheckboxDefaultProps, QuestionCheckboxPropsType } from './interface'
import IconFont from '../../../utools/IconFont'

const { Paragraph } = Typography

const Component: FC<QuestionCheckboxPropsType> = (props: QuestionCheckboxPropsType) => {
	const { title, isVertical, list, isShowTitle, isMustFill, isShow } = {
		...QuestionCheckboxDefaultProps,
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
			<Space direction={isVertical ? 'vertical' : 'horizontal'} wrap>
				{list?.map(opt => {
					const { value, text, checked } = opt
					return (
						<Checkbox
							key={value}
							value={value}
							checked={checked}
							style={{
								borderRadius: '8px',
								border: '1px solid #dcdfe6',
								padding: '5px 12px',
							}}
						>
							{text}
						</Checkbox>
					)
				})}
			</Space>
		</div>
	)
}

export default Component
