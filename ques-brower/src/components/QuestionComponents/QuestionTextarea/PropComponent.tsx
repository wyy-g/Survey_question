import React, { FC, useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { QuestionTextareaPropsType, QuestionTextareaDefaultProps } from './interface'

const PropComponent: FC<QuestionTextareaPropsType> = (props: QuestionTextareaPropsType) => {
	const {
		title,
		placeholder,
		isClear,
		isShow,
		isShowTitle,
		isMustFill,
		onChange,
		customErrorMessage,
	} = {
		...QuestionTextareaDefaultProps,
		...props,
	}
	const [form] = Form.useForm()

	useEffect(() => {
		form.setFieldsValue({
			title,
			placeholder,
			isClear,
			isShow,
			isShowTitle,
			isMustFill,
			customErrorMessage,
		})
	}, [title, placeholder, isClear, isShow, isShowTitle, isMustFill, customErrorMessage])

	function handleValueChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				placeholder,
				isClear,
				isShow,
				isShowTitle,
				isMustFill,
				customErrorMessage,
			}}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="占位文案" name="placeholder">
				<Input />
			</Form.Item>
			<Form.Item label="显示标题" name="isShowTitle">
				<Switch />
			</Form.Item>
			<Form.Item label="能否清空" name="isClear">
				<Switch />
			</Form.Item>
			<Form.Item
				label="隐藏组件"
				name="isShow"
				tooltip="开启此属性，则组件发布后不会显示，可作为备注使用"
			>
				<Switch />
			</Form.Item>
			<Form.Item label="是否必填" name="isMustFill">
				<Switch />
			</Form.Item>
			<Form.Item
				label="错误提示"
				tooltip="填表者在提交不符合校验规则的数据时，会显示此处自定义的文案。"
				name="customErrorMessage"
			>
				<Input />
			</Form.Item>
		</Form>
	)
}

export default PropComponent
