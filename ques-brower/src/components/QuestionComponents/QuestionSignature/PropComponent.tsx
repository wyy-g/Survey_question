import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, ColorPicker } from 'antd'
import { QuestionSignatureDefaultProps, QuestionSingaturePropsType } from './interface'

const PropComponent: FC<QuestionSingaturePropsType> = (props: QuestionSingaturePropsType) => {
	const {
		title,
		placeholder,
		isShowTitle,
		isMustFill,
		isShow,
		color,
		onChange,
		customErrorMessage,
	} = {
		...QuestionSignatureDefaultProps,
		...props,
	}

	const [form] = Form.useForm()

	function handleValueChange() {
		if (onChange) {
			const props = form.getFieldsValue()
			const newProps = {
				...props,
				color:
					typeof props.color?.toHexString === 'function' ? props.color?.toHexString() : props.color,
			}
			onChange(newProps)
		}
	}

	useEffect(() => {
		const colorStr = typeof color?.toHexString === 'function' ? color?.toHexString() : color
		form.setFieldsValue({
			title,
			placeholder,
			isShow,
			isShowTitle,
			isMustFill,
			color: colorStr,
			customErrorMessage,
		})
	}, [title, placeholder, isShow, isShowTitle, isMustFill, color, customErrorMessage])

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				placeholder,
				isShow,
				isShowTitle,
				isMustFill,
				color,
				customErrorMessage,
			}}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label="描述" name="title" rules={[{ required: true, message: '请输入描述' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="提示" name="placeholder">
				<Input />
			</Form.Item>
			<Form.Item label="显示描述" name="isShowTitle">
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
			<Form.Item label="颜色" name="color">
				<ColorPicker showText />
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
