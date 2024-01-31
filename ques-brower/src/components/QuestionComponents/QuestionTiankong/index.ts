/**
 * @description 问卷多行输入
 */

import Component from './component'
import PropComponent from './PropComponent'
import { QuestionTiankongDefaultProps } from './interface'

export * from './interface'

export default {
	title: '多项填空',
	type: 'questionTiankong',
	Component, //画布显示的
	PropComponent, //属性组件显示的
	defaultProps: QuestionTiankongDefaultProps,
}
