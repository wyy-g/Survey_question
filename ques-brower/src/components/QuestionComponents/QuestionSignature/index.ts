import Component from './component'
import PropComponent from './PropComponent'
import { QuestionSignatureDefaultProps } from './interface'
export * from './interface'

export default {
	title: '电子签名',
	type: 'questionSignature',
	Component,
	PropComponent,
	defaultProps: QuestionSignatureDefaultProps,
}
