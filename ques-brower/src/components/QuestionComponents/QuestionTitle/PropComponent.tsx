import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { QuestionTitlePropsType, QuestionTitleDefaultProps } from './interface'

const PropComponent: FC<QuestionTitlePropsType> = (props: QuestionTitlePropsType) => {
	const { text, level, isCenter, onChange } = {
		...QuestionTitleDefaultProps,
		...props,
	}
	const [form] = Form.useForm()
	useEffect(() => {
		form.setFieldsValue({
			text,
			level,
			isCenter,
		})
	}, [text, level, isCenter])

	function handleValueChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{ text, level, isCenter }}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item
				label="标题内容"
				name="text"
				rules={[{ required: true, message: '请输入标题内容' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item label="层级" name="level">
				<Select
					options={[
						{ value: 1, text: 1 },
						{ value: 2, text: 2 },
						{ value: 3, text: 3 },
					]}
				></Select>
			</Form.Item>
			<Form.Item label="是否居中" name="isCenter">
				<Switch />
			</Form.Item>
		</Form>
	)
}

export default PropComponent
