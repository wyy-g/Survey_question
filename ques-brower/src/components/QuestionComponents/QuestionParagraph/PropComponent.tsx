import React, { FC, useEffect } from 'react'
import { Form, Input } from 'antd'
import { QuestionParagraphProps } from './interface'

const { TextArea } = Input

const PropComponent: FC<QuestionParagraphProps> = (props: QuestionParagraphProps) => {
	const { text, onChange } = props
	const [form] = Form.useForm()

	useEffect(() => {
		form.setFieldsValue({ text })
	}, [text])

	function handleValuesChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{ text }}
			onValuesChange={handleValuesChange}
			form={form}
		>
			<Form.Item
				label="描述内容"
				name="text"
				rules={[{ required: true, message: '请输入描述内容' }]}
			>
				<TextArea />
			</Form.Item>
		</Form>
	)
}

export default PropComponent
