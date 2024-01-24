/**
 * @description 问卷-段落
 */

import Component from './component'
import { QuestionParagraphDefaultProps } from './interface'
import PropComponent from './PropComponent'

export * from './interface'

export default {
	title: '段落',
	type: 'questionParagraph',
	Component,
	PropComponent,
	defaultProps: QuestionParagraphDefaultProps,
}
