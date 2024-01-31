/**
 *  @description checkbox 的配置
 */
import Component from './component'
import PropComponent from './PropComponent'
import { QuestionCheckboxDefaultProps } from './interface'

export * from './interface'

export default {
	title: '多选',
	type: 'questionCheckbox',
	Component,
	PropComponent,
	defaultProps: QuestionCheckboxDefaultProps,
}
