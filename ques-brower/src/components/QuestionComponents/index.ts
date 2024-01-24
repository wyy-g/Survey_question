import { FC } from 'react'
import QuestionInputConf, { QuestionInputPropsType } from './QuestionInput'
import QuestionTitleConf, { QuestionTitlePropsType } from './QuestionTitle'
import QuestionParagraphConf, { QuestionParagraphProps } from './QuestionParagraph'

// 各个组件的props
export type ComponentPropsType = QuestionInputPropsType &
	QuestionTitlePropsType &
	QuestionParagraphProps

//组件的配置
export type ComponentConfType = {
	title?: string
	type: string
	Component: FC<ComponentPropsType>
	PropComponent: FC<ComponentPropsType>
	defaultProps: ComponentPropsType
}

//全部的组件配置列表
const componentConfList: ComponentConfType[] = [
	QuestionInputConf,
	QuestionTitleConf,
	QuestionParagraphConf,
]

export function getComponentConfByType(type: string) {
	return componentConfList.find(c => c.type === type)
}
