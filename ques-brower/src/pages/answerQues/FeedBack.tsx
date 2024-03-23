import React, { FC, useState } from 'react'
import { Button, Modal, Form, Input, message } from 'antd'
import { useRequest } from 'ahooks'
import { submitFeedback } from '../../services/answer'

type FeedBackProps = {
	survey_id: number
}

const Feedback: FC<FeedBackProps> = (props: FeedBackProps) => {
	const { survey_id } = props
	const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

	const [form] = Form.useForm()

	function handleOk() {
		setFeedbackModalOpen(false)
		const params = {
			...form.getFieldsValue(),
			survey_id,
		}
		run(params)
	}

	function handleCancel() {
		setFeedbackModalOpen(false)
		form.resetFields()
	}

	const { run } = useRequest(async params => await submitFeedback(params), {
		manual: true,
		onSuccess: () => {
			message.success('感谢您的反馈')
		},
		onError: () => {
			message.error('提交反馈出错，请稍后再试')
		},
	})

	// 邮箱的验证规则
	function validateEmail(_: any, value: any) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return !value || emailPattern.test(value)
			? Promise.resolve()
			: Promise.reject(new Error('请输入有效的邮箱地址'))
	}

	return (
		<>
			<Button type="primary" onClick={() => setFeedbackModalOpen(true)}>
				问卷反馈建议
			</Button>
			<Modal
				title="问卷反馈建议"
				open={feedbackModalOpen}
				okText="确认"
				cancelText="取消"
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} labelCol={{ span: 4 }}>
					<Form.Item
						name="comment"
						label="反馈"
						rules={[{ required: true, message: '反馈建议不能为空' }]}
					>
						<Input.TextArea></Input.TextArea>
					</Form.Item>
					<Form.Item name="username" label="账号">
						<Input placeholder="请留下您的账号，方便我们联系您" />
					</Form.Item>
					<Form.Item name="email" label="邮箱" rules={[{ validator: validateEmail }]}>
						<Input placeholder="请留下您的邮箱，方便我们联系您" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default Feedback
