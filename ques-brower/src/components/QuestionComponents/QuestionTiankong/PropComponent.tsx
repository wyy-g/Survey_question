import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, Button, Divider } from 'antd'
import { QuestionTiankongDefaultProps, QuestionTiankongPropsType } from './interface'
import IconFont from '../../../utools/IconFont'

const { TextArea } = Input

const PropComponent: FC<QuestionTiankongPropsType> = (props: QuestionTiankongPropsType) => {
	const { title, isMustFill, isShow, isShowTitle, content, onChange, customErrorMessage } = {
		...QuestionTiankongDefaultProps,
		...props,
	}

	const [form] = Form.useForm()

	useEffect(() => {
		form.setFieldsValue({ title, isShow, isShowTitle, isMustFill, content, customErrorMessage })
	}, [title, isShow, isShowTitle, isMustFill, content])

	function handleValueChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}

	function handleClick() {
		const currentContent = form.getFieldValue('content')
		const updatedContent = `${currentContent}$input;`
		form.setFieldsValue({ content: updatedContent })
		handleValueChange()
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{ title, isMustFill, isShow, isShowTitle, content, customErrorMessage }}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
			onValuesChange={handleValueChange}
			form={form}
		>
			<Form.Item label="横向填空" name="title" rules={[{ required: true, message: '请输入标题' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="显示标题" name="isShowTitle">
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
			<Divider>填空内容</Divider>
			<Form.Item name="content" wrapperCol={{ span: 24 }}>
				<TextArea></TextArea>
			</Form.Item>
			<Button type="link" icon={<IconFont type="icon-plus-border" />} onClick={handleClick} block>
				插入填空
			</Button>
		</Form>
	)
}

export default PropComponent
