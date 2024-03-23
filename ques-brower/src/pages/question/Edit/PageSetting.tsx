import React, { FC, useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { resetPageInfo } from '../../../store/pageInfoReducer'

const PageSetting: FC = () => {
	const pageInfo = useGetPageInfo()
	const { isPublished, createdAt, updatedAt } = pageInfo
	const [form] = Form.useForm()

	const dispatch = useDispatch()

	function handleValueChange() {
		dispatch(resetPageInfo({ ...form.getFieldsValue(), isPublished, createdAt, updatedAt }))
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
				<Input.TextArea
					placeholder="请输入问卷描述"
					maxLength={200}
					style={{ height: 100, width: '180px' }}
					showCount
				></Input.TextArea>
			</Form.Item>
			<Form.Item label="显示题目序号" name="isShowOrderIndex">
				<Switch />
			</Form.Item>
			<Form.Item label="是否开启反馈" name="isEnableFeedback">
				<Switch />
			</Form.Item>
		</Form>
	)
}

export default PageSetting
