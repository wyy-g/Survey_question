/**
 * @description 评分
 * @author wy
 */

import Component from './component'
import PropComponent from './PropComponent'
import { QuestionMarkDefaultProps } from './interface'
export * from './interface'

export default {
	title: '评分',
	type: 'questionMark',
	Component, //画布显示的组件
	PropComponent, //修改属性的组件
	defaultProps: QuestionMarkDefaultProps,
}
