/**
 * @description 问卷输入框
 * @author wy
 */

import Component from './component'
import PropComponent from './PropComponent'
import { QuestionInputDefaultProps } from './interface'
export * from './interface'

export default {
	title: '单行输入框',
	type: 'questionInput',
	Component, //画布显示的组件
	PropComponent, //修改属性的组件
	defaultProps: QuestionInputDefaultProps,
}
