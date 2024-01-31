import React, { FC, useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { resetPageInfo } from '../../../store/pageInfoReducer'

const PageSetting: FC = () => {
	const pageInfo = useGetPageInfo()
	const [form] = Form.useForm()

	const dispatch = useDispatch()

	function handleValueChange() {
		dispatch(resetPageInfo(form.getFieldsValue()))
	}

	useEffect(() => {
		form.setFieldsValue(pageInfo)
	}, [pageInfo])

	return (
		<Form
			layout="horizontal"
			initialValues={pageInfo}
			onValuesChange={handleValueChange}
			form={form}
			labelCol={{ span: '8' }}
			wrapperCol={{ span: '16' }}
		>
			<Form.Item
				label="问卷标题"
				name="title"
				rules={[{ required: true, message: '问卷标题不能为空' }]}
			>
				<Input placeholder="请输入标题" />
			</Form.Item>
			<Form.Item label="问卷描述" name="description">
				<Input.TextArea placeholder="请输入问卷描述"></Input.TextArea>
			</Form.Item>
			<Form.Item label="显示题目序号" name="isShowOrderIndex">
				<Switch />
			</Form.Item>
		</Form>
	)
}

export default PageSetting
