import React, { FC } from 'react'
import { Typography, Input } from 'antd'
import { QuestionTiankongPropsType, QuestionTiankongDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'

const { Paragraph } = Typography

const Component: FC<QuestionTiankongPropsType> = (props: QuestionTiankongPropsType) => {
	const { title, isMustFill, isShowTitle, content } = {
		...QuestionTiankongDefaultProps,
		...props,
	}

	const contentList = content?.split('$')
	let textList: string[] = []
	contentList?.forEach((item: string) => {
		if (item.includes('input;')) {
			const parts = item.split(';')
			textList = [...textList, ...parts]
		} else {
			textList.push(item)
		}
	})

	return (
		<div>
			{isShowTitle && (
				<Paragraph strong>
					{isMustFill && <IconFont type="icon-bitian" />}
					<span style={{ marginLeft: '2px' }}>{title}</span>
				</Paragraph>
			)}
			<div>
				{textList!.map((text, index) => (
					<span key={index} style={{ fontSize: '14px', color: '#606266', margin: '0 6px' }}>
						{text !== 'input' ? (
							text
						) : (
							<input
								style={{
									borderColor: ' #878787',
									borderStyle: 'solid',
									borderTopWidth: '0',
									borderRightWidth: '0',
									borderBottomWidth: '1px',
									borderLeftWidth: '0',
									backgroundColor: 'transparent',
									width: '70px',
								}}
							/>
						)}
					</span>
				))}
			</div>
		</div>
	)
}

export default Component
