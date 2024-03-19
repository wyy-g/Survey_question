import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { QuestionDatePropsType, QUestionDateDefaultProps, formatType } from './interface'

const PropComponent: FC<QuestionDatePropsType> = (props: QuestionDatePropsType) => {
	const { title, isClear, isShow, isShowTitle, isMustFill, onChange, customErrorMessage, format } =
		{
			...QUestionDateDefaultProps,
			...props,
		}

	const [form] = Form.useForm()
	const formatDate: { [value: string]: string }[] = [
		{ value: 'year', label: '年' },
		{ value: 'quarter', label: '年-季' },
		{ value: 'month', label: '年-月' },
		{ value: 'week', label: '年-周' },
		{ value: ' ', label: '年-月-日' },
		{ value: 'dateTime', label: '年-月-日 时-分-秒' },
	]

	function handleValueChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}
	useEffect(() => {
		form.setFieldsValue({
			title,
			isClear,
			isShow,
			isShowTitle,
			isMustFill,
			customErrorMessage,
			format,
		})
	}, [title, isClear, isShow, isShowTitle, isMustFill, customErrorMessage, format])

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				isClear,
				isShow,
				isShowTitle,
				isMustFill,
				customErrorMessage,
				format,
			}}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="格式" name="format">
				<Select defaultValue=" " style={{ width: 160 }} options={formatDate} />
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
