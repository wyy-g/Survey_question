/**
 * @description 日期
 * @author wy
 */

import Component from './Component'
import PropComponent from './PropComponent'
import { QUestionDateDefaultProps } from './interface'
export * from './interface'

export default {
	title: '日期',
	type: 'questionDate',
	Component, //画布显示的组件
	PropComponent, //修改属性的组件
	defaultProps: QUestionDateDefaultProps,
}
