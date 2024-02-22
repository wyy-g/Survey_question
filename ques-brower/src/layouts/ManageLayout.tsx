import React, { FC, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './manageLayout.module.scss'
import { createQuesService } from '../services/question'
import { getUserIdStorage } from '../utools/user-storage'

const { TextArea } = Input

const ManageLayout: FC = () => {
	const userId = getUserIdStorage()
	const nav = useNavigate()
	const { pathname } = useLocation()
	// 表单标题（之后要替换在redux中）
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	// 是否显示新建问卷的弹窗
	const [isShowModal, setIsShowModal] = useState(false)
	// 新建问卷标题必填的校验 ->获取form
	const [form] = Form.useForm()

	const modalView = (
		<>
			<Form labelCol={{ span: 4 }} form={form} initialValues={{ description, title }}>
				<Form.Item
					label="问卷名称"
					name="title"
					rules={[{ required: true, message: '问卷名称不能为空' }]}
				>
					<Input value={title} onChange={e => setTitle(e.target.value)} />
				</Form.Item>
				<Form.Item label="问卷描述" name="description">
					<TextArea value={description} onChange={e => setDescription(e.target.value)} />
				</Form.Item>
			</Form>
		</>
	)

	//处理提交问卷标题
	function handleCreateClick() {
		form
			.validateFields()
			.then(async values => {
				const data = await createQuesService(values.title, Number(userId), values.description)
				const { id } = data || {}
				if (id) {
					nav(`/question/edit/${id}`)
					message.success('创建成功')
				}
				setIsShowModal(false)
				form.resetFields()
			})
			.catch(errorInfo => {
				message.error('问卷标题填写有误，请检查后重新提交')
			})
	}
	// modal取消时的函数
	function handleModalCancel() {
		setIsShowModal(false)
		// 重置表单
		form.resetFields()
	}

	return (
		<div className={styles['container']}>
			<div className={styles['left']}>
				<Space direction="vertical">
					<Button
						type="primary"
						size="large"
						icon={<PlusOutlined />}
						style={{ width: '180px', marginBottom: '20px' }}
						onClick={() => setIsShowModal(true)}
					>
						新建问卷
					</Button>
					<Button
						type={pathname.startsWith('/manage/list') ? 'default' : 'text'}
						size="large"
						icon={<BarsOutlined />}
						style={{ width: '180px' }}
						onClick={() => nav('/manage/list')}
					>
						我的问卷
					</Button>
					<Button
						type={pathname.startsWith('/manage/star') ? 'default' : 'text'}
						size="large"
						icon={<StarOutlined />}
						style={{ width: '180px' }}
						onClick={() => nav('/manage/star')}
					>
						星标问卷
					</Button>
					<Button
						type={pathname.startsWith('/manage/trash') ? 'default' : 'text'}
						size="large"
						icon={<DeleteOutlined />}
						style={{ width: '180px' }}
						onClick={() => nav('/manage/trash')}
					>
						回收站
					</Button>
				</Space>
			</div>
			<div className={styles['right']}>
				<Outlet />
			</div>
			{/* 新建问卷后弹出modal */}
			<Modal
				title="新建问卷"
				open={isShowModal}
				onOk={handleCreateClick}
				onCancel={handleModalCancel}
				okText="创建"
				cancelText="取消"
			>
				{modalView}
			</Modal>
		</div>
	)
}

export default ManageLayout
