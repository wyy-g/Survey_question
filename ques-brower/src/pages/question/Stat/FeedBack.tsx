import React, { FC, useState } from 'react'
import { Button, Modal, message, Space, Table, Popover, Popconfirm, Skeleton } from 'antd'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
import { getFeedback, delFeedback } from '../../../services/answer'

const Feedback: FC = () => {
	const { id } = useParams()
	const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
	const [feedbackData, setFeedbackData] = useState([])

	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			key: 'index',
			width: 80,
			render: (_: any, record: any, index: number) => <span>{index + 1}</span>,
		},
		{
			title: '反馈用户账号',
			dataIndex: 'username',
			key: 'username',
			width: 150,
		},
		{
			title: '反馈用户邮箱',
			dataIndex: 'email',
			key: 'email',
			width: 150,
		},
		{
			title: '反馈内容',
			dataIndex: 'comment',
			key: 'comment',
			width: 300,
			render: (text: string) => (
				<Popover content={<div style={{ maxWidth: '500px' }}>{text}</div>} placement="top">
					<div style={{ cursor: 'pointer' }}>
						{text.length > 25 ? text.slice(0, 25) + '.....' : text}
					</div>
				</Popover>
			),
		},
		{
			title: '反馈时间',
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			render: (text: string) => {
				return moment.utc(text).local().format('YYYY-MM-DD HH:mm:ss')
			},
		},
		{
			title: '操作',
			key: 'action',
			width: 120,
			render: (_: any, record: any) => (
				<Space>
					<Popconfirm
						title="确定要删除吗？"
						okText="确定"
						cancelText="取消"
						onConfirm={() => delRun(record.feedback_id)}
					>
						<Button type="link" danger>
							删除
						</Button>
					</Popconfirm>
					{record.username && <Button type="link">去联系</Button>}
				</Space>
			),
		},
	]

	const { run, loading, refresh } = useRequest(
		async id => {
			const data = await getFeedback(Number(id))
			return data
		},
		{
			manual: true,
			onSuccess: (data: any) => {
				setFeedbackData(data)
			},
		},
	)

	const { run: delRun, loading: loadDeledLoading } = useRequest(
		async id => {
			await delFeedback(Number(id))
		},
		{
			manual: true,
			onSuccess: () => {
				message.success('删除反馈成功')
				refresh()
			},
		},
	)

	const dataSource = feedbackData.map((item: any, index) => ({
		key: item.feedback_id || index,
		...item,
		index: index + 1,
	}))

	function handleCancel() {
		setFeedbackModalOpen(false)
	}

	return (
		<>
			<Button
				onClick={() => {
					setFeedbackModalOpen(true)
					run(id)
				}}
			>
				反馈收集
			</Button>
			<Modal
				title="反馈建议"
				open={feedbackModalOpen}
				okText="确认"
				cancelText="取消"
				onCancel={handleCancel}
				width={950}
				footer={null}
			>
				{loading ? (
					<Skeleton />
				) : (
					<Table
						dataSource={dataSource}
						scroll={{ x: true }}
						columns={columns}
						loading={loadDeledLoading}
					/>
				)}
			</Modal>
		</>
	)
}

export default Feedback
