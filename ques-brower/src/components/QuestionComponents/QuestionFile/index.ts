/**
 * @description 上传文件
 * @author wy
 */

import Component from './component'
import PropComponent from './PropComponent'
import { QuestionFileDefaultProps } from './interface'
export * from './interface'

export default {
	title: '文件/图片上传',
	type: 'questionFile',
	Component, //画布显示的组件
	PropComponent, //修改属性的组件
	defaultProps: QuestionFileDefaultProps,
}
