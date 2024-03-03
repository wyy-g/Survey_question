import React, { FC, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
	Button,
	Space,
	Modal,
	Form,
	Input,
	message,
	Divider,
	Spin,
	Steps,
	Slider,
	Col,
	InputNumber,
	Row,
} from 'antd'
import {
	PlusOutlined,
	BarsOutlined,
	StarOutlined,
	DeleteOutlined,
	DownOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import styles from './manageLayout.module.scss'
import { createQuesService, genAiQuestion, createAiQues } from '../services/question'
import { getUserIdStorage } from '../utools/user-storage'
import IconFont from '../utools/IconFont'
import addZero from '../utools/addZero'

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
	// ai创作的用户输入的信息（不止可以只输入标题）
	const [aiTitle, setAiTitle] = useState('')
	// ai创作的form表单
	const [aiForm] = Form.useForm()
	// ai 生成问题时loading
	const [aiGenQuesLoading, setAiGenQuesLoading] = useState(false)
	// ai 生成的问题
	const [aiGenComponent, setAiGenComponent] = useState<{ [key: string]: string | number }[]>([])
	// 是否显示如何使用
	const [isShowHowUse, setIsShowHowUse] = useState(false)
	// 是否显示设置数量
	const [isShowSetting, setIsShowSetting] = useState(false)
	// 存储生成多少问卷数量
	const [quesNum, setQuesNum] = useState(5)
	// ai生成问卷的标题（返回的信息）
	const [aiGenTitle, setAiGenTitle] = useState('')
	// ai生成的描述
	const [aiGenDescription, setAiGenDescription] = useState('')
	// ai创作的示例（输入的信息）
	const exampleInputQuesInfo = [
		'为新员工创建一个入职调查问卷',
		'为学生创建一份教学质量评估问卷',
		'为买家创建一份售后问卷调查',
		'为游客创建一份旅游目的地评估表',
		'为参与者创建一个会议评估表',
		'为客户创建一份银行服务体验调查问卷',
		'为患者创建一份医疗服务质量评估问卷',
		'为患者创建一份医疗服务质量评估问卷',
		'为观众创建一个音乐节反馈表',
		'为用户创建一个产品体验调查问卷',
		'为游客创建一份旅游目的地评估表',
		'为某APP的用户创建一份产品易用性调查',
		'为玩家创建一个游戏体验调查问卷',
	]

	// 改变生成多少的卷数量
	function onChangeQuesNum(newValue: number | null) {
		if (!newValue) return
		setQuesNum(newValue)
	}
	// 删除某个ai生成的问题
	function deleteAIQuestion(order_index: number | string) {
		const filterAiCom = aiGenComponent.filter(c => c.order_index !== order_index)
		const finalAiCom = filterAiCom.map((c, index) => {
			return {
				...c,
				order_index: index + 1,
			}
		})
		setAiGenComponent(finalAiCom)
	}

	const { run: createAiQuesFun, loading: createAiQuesLoading } = useRequest(
		async () => {
			const createdResData = await createAiQues({
				title: aiGenTitle,
				description: aiGenDescription,
				componentList: aiGenComponent,
			})
			return createdResData
		},
		{
			manual: true,
			onSuccess: data => {
				const { id } = data
				nav(`/question/edit/${id}`)
				setAiGenComponent([])
				message.success('AI 创建问卷成功')
			},
		},
	)

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
						<Form.Item name="aiTitle" rules={[{ required: true, message: '表单问卷信息' }]}>
							<TextArea
								showCount
								maxLength={200}
								value={aiTitle}
								onChange={e => setAiTitle(e.target.value)}
								placeholder="输入你想要创建的表单问卷信息"
								style={{ height: 120, resize: 'none', width: '270px' }}
							/>
						</Form.Item>
					</Form>
					<Button type="primary" onClick={handleGeneratorQues} loading={aiGenQuesLoading}>
						生成问题
					</Button>
					<div className={styles['ai-left-more']}>
						<Button
							type="link"
							style={{ paddingLeft: '0' }}
							onClick={() => {
								setIsShowHowUse(!isShowHowUse)
								setIsShowSetting(false)
							}}
						>
							如果使用
							<DownOutlined />
						</Button>

						<Button
							type="link"
							style={{ paddingRight: '0' }}
							onClick={() => {
								setIsShowSetting(!isShowSetting)
								setIsShowHowUse(false)
							}}
						>
							设置问题数量
						</Button>
					</div>
					{isShowHowUse && !isShowSetting && (
						<div className={styles['how-use']}>
							<Steps
								progressDot
								current={-1}
								direction="vertical"
								style={{ width: '100%' }}
								items={[
									{
										title: '第一步',
										description: '输入你想要创建的表单问卷信息，或者直接选择示例',
									},
									{
										title: '第二步',
										description: '点击生成问题，耐心等待一小会儿(约1分钟)，系统会自动为你生成问题',
									},
									{
										title: '第三步',
										description: '点击创建，耐心等待一小会儿，系统会自动为你创建问卷表单',
									},
								]}
							/>
						</div>
					)}
					{!isShowHowUse && isShowSetting && (
						<div className={styles['set-num']}>
							<Row>
								<Col span={14}>
									<Slider
										min={5}
										max={10}
										onChange={onChangeQuesNum}
										value={typeof quesNum === 'number' ? quesNum : 0}
									/>
								</Col>
								<Col span={2}>
									<InputNumber
										min={5}
										max={10}
										style={{ margin: '0 16px' }}
										value={quesNum}
										onChange={onChangeQuesNum}
									/>
								</Col>
							</Row>
						</div>
					)}
				</div>
				{/* <div> */}
				<Divider
					type="vertical"
					style={{
						height: '100%',
						borderRight: 0,
						margin: '0 0px',
					}}
				/>
				{/* </div> */}
				<div className={styles['ai-right']}>
					<span style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
						{aiGenComponent.length > 0 ? '问题预览' : '示例'}
					</span>
					<Spin spinning={createAiQuesLoading} tip="问卷正在创建中.....">
						{aiGenQuesLoading ? (
							<div
								style={{
									marginTop: '100px',
									height: '100%',
									width: '100%',
								}}
							>
								<Spin tip="正在生成中，请耐心等待">
									<div className="content" />
								</Spin>
							</div>
						) : aiGenComponent.length > 0 ? (
							aiGenComponent.map(aic => {
								return (
									<div key={aic.id} className={styles['ai-right-com']}>
										<div className={styles['ai-right-com-info']}>
											<div>
												<span>{addZero(aic.order_index!)}&nbsp;</span>
												<span style={{ marginLeft: '2px' }}>{aic.title}</span>
											</div>
											<Button
												type="text"
												icon={<IconFont type="icon-shanchu" />}
												onClick={() => deleteAIQuestion(aic.order_index)}
											></Button>
										</div>
										<Divider style={{ margin: '5px 0', width: '100%' }} />
									</div>
								)
							})
						) : (
							exampleInputQuesInfo.map((example, index) => {
								return (
									<div
										key={index}
										className={`${styles['ai-right-com']}`}
										onClick={() => aiForm.setFieldsValue({ aiTitle: example })}
									>
										<div className={styles['ai-right-com-info']}>
											<div>
												<span style={{ marginLeft: '5px', cursor: 'pointer' }}>{example}</span>
											</div>
											{/* <Button
												type="text"
												icon={<IconFont type="icon-shanchu" />}
												onClick={() => {
													setAiTitle(example)
												}}
											></Button> */}
										</div>
										<Divider style={{ margin: '5px 0', width: '100%' }} />
									</div>
								)
							})
						)}
					</Spin>
				</div>
			</div>
		</>
	)

	//处理提交问卷标题
	function handleCreateClick() {
		aiForm
			.validateFields()
			.then(async values => {
				const data = await createQuesService(values.title, Number(userId), values.description)
				const { id } = data || {}
				if (id) {
					nav(`/question/edit/${id}`)
					message.success('创建成功')
				}
				setIsShowModal(false)
				aiForm.resetFields()
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
		createAiQuesFun()
	}
	// 处理ai创作取消
	function handleModalAiCancel() {
		setIsShowAiModal(false)
		// 重置表单
		// aiForm.resetFields()
	}

	// 处理ai创作生成问题
	function handleGeneratorQues() {
		aiForm
			.validateFields()
			.then(async values => {
				try {
					setAiGenQuesLoading(true)
					const data = await genAiQuestion({ title: values.aiTitle, quesNum })
					if (data && data.componentList.length > 0) {
						setAiGenComponent(data.componentList)
					}
					if (data.title) {
						setAiGenTitle(data.title)
					}
					if (data.description) {
						setAiGenDescription(data.description)
					}
					setAiGenQuesLoading(false)
				} catch (error) {
					console.error('生成问卷时发生错误:', error)
					message.error('生成问卷失败，请稍候重试或检查输入内容')
					setAiGenQuesLoading(false)
				}
			})
			.catch(errorInfo => {
				console.error('表单校验失败:', errorInfo)
				message.error('表单校验未通过，请检查必填项')
				setAiGenQuesLoading(false)
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
				onCancel={handleModalAiCancel}
				okText="创建"
				cancelText="取消"
				width="850px"
				okButtonProps={{ disabled: aiGenComponent.length > 0 ? false : true }}
			>
				<Divider style={{ margin: '0' }} />
				{aiModalView}
				<Divider style={{ margin: '0' }} />
			</Modal>
		</div>
	)
}

export default ManageLayout
