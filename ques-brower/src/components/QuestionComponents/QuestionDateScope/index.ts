/**
 * @description 日期
 * @author wy
 */

import Component from './Component'
import PropComponent from './PropComponent'
import { QUestionDateScopeDefaultProps } from './interface'
export * from './interface'

export default {
	title: '日期范围',
	type: 'questionDateScope',
	Component, //画布显示的组件
	PropComponent, //修改属性的组件
	defaultProps: QUestionDateScopeDefaultProps,
}
