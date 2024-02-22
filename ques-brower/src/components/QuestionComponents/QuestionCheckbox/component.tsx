import React, { FC, useState, useEffect } from 'react'
import { Typography, Space, Checkbox } from 'antd'
import { QuestionCheckboxDefaultProps, QuestionCheckboxPropsType } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'

const { Paragraph } = Typography

const Component: FC<QuestionCheckboxPropsType> = (props: QuestionCheckboxPropsType) => {
	const {
		title,
		isVertical,
		list = [],
		isShowTitle,
		isMustFill,
		isShow,
		order_index,
		isShowOrderIndex,
	} = {
		...QuestionCheckboxDefaultProps,
		...props,
	}

	// 初始化内部状态，根据 list 中每个选项的 checked 状态
	const [checkboxValues, setCheckboxValues] = useState<{ [key: string]: boolean }>(
		list.reduce((acc, opt) => ({ ...acc, [opt.value]: !!opt.checked }), {}),
	)

	// 定义一个通用的handleChange函数
	const handleChange = (value: string) => {
		setCheckboxValues(prevState => ({
			...prevState,
			[value]: !prevState[value],
		}))
	}

	useEffect(() => {
		setCheckboxValues(list.reduce((acc, opt) => ({ ...acc, [opt.value]: !!opt.checked }), {}))
	}, [list])

	return (
		<div>
			<div>
				{isShowTitle && (
					<Paragraph strong style={{ fontSize: '16px' }}>
						{isMustFill && <IconFont type="icon-bitian" />}
						{/* 后端返回的isShowOrderIndex是0会显示到前端 */}
						{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}
						<span style={{ marginLeft: '2px' }}>{title}</span>
					</Paragraph>
				)}
			</div>
			<Space direction={isVertical ? 'vertical' : 'horizontal'} wrap style={{ marginLeft: '15px' }}>
				{list?.map(opt => {
					const { value, text } = opt
					// 根据内部状态设置默认选中状态
					const checked = checkboxValues[value]
					return (
						<Checkbox
							key={value}
							value={value}
							checked={checked}
							style={{
								borderRadius: '8px',
								border: '1px solid #dcdfe6',
								padding: '5px 12px',
								minWidth: '150px',
							}}
							onChange={() => handleChange(value)}
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
