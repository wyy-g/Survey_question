import React, { FC, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './manageLayout.module.scss'
import { createQuesService, genAiQuestion } from '../services/question'
import { getUserIdStorage } from '../utools/user-storage'
import IconFont from '../utools/IconFont'

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
	// 是否显示AI创作的modal
	const [isShowAiModal, setIsShowAiModal] = useState(false)
	// 新建问卷标题必填的校验 ->获取form
	const [form] = Form.useForm()
	// ai创作的标题
	const [aiTitle, setAiTitle] = useState('')
	// ai创作的form表单
	const [aiForm] = Form.useForm()

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

	const aiModalView = (
		<>
			<div className={styles['ai-wrapper']}>
				<div className={styles['ai-left']}>
					<Form initialValues={{ aiTitle }} form={aiForm}>
						<Form.Item name="aiTitle">
							<TextArea
								showCount
								maxLength={200}
								onChange={e => setAiTitle(e.target.value)}
								placeholder="输入你想要创建的表单问卷信息"
								style={{ height: 150, resize: 'none' }}
							/>
						</Form.Item>
					</Form>
					<Button type="primary" onClick={handleGeneratorQues}>
						生成问题
					</Button>
				</div>
			</div>
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

	// 处理ai创作点击创建
	function handleCreateAiClick() {
		return false
	}

	// 处理ai创作生成问题
	function handleGeneratorQues() {
		aiForm.validateFields().then(async values => {
			const data = await genAiQuestion(values.aiTitle)
			console.log('aiData', data)
		})
	}

	return (
		<div className={styles['container']}>
			<div className={styles['left']}>
				<Space direction="vertical">
					<Button
						type="primary"
						size="large"
						icon={<PlusOutlined />}
						style={{ width: '180px', marginBottom: '5px' }}
						onClick={() => setIsShowModal(true)}
					>
						新建问卷
					</Button>
					<Button
						// type="primary"
						size="large"
						style={{
							width: '180px',
							marginBottom: '20px',
							color: '#fae0a5',
							backgroundColor: '#272a33',
							borderColor: 'transparent',
						}}
						onClick={() => setIsShowAiModal(true)}
						icon={<IconFont type="icon-jiqiren" />}
					>
						AI&nbsp;创作（BETA）
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
			<Modal
				title="AI&nbsp;创作（BETA）"
				open={isShowAiModal}
				onOk={handleCreateAiClick}
				onCancel={handleModalCancel}
				okText="创建"
			>
				{aiModalView}
			</Modal>
		</div>
	)
}

export default ManageLayout
