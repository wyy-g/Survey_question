/**
 * @description 问卷得radio组件
 */
import Component from './component'
import { QuestionRadioDefaultProps } from './interface'
import PropComponent from './PropComponent'

export * from './interface'

export default {
	title: '单选框组',
	type: 'questionRadio',
	Component,
	PropComponent,
	defaultProps: QuestionRadioDefaultProps,
}
