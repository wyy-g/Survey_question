/**
 * @description 问卷多行输入
 */

import Component from './Component'
import PropComponent from './PropComponent'
import { QuestionTextareaDefaultProps } from './interface'

export * from './interface'

export default {
	title: '多行输入框',
	type: 'questionTextarea',
	Component, //画布显示的
	PropComponent, //属性组件显示的
	defaultProps: QuestionTextareaDefaultProps,
}
