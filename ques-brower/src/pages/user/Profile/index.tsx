import React, { FC, useEffect, useState } from 'react'
import { Divider, Button, Tabs, Form, Input, Space, Modal, Upload, message, Row, Col } from 'antd'
import type { UploadProps, UploadFile } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
/* eslint-enable */
import styles from './index.module.scss'
import { getUserIdStorage } from '../../../utools/user-storage'
import useGetUserInfo from '../../../hooks/useGetUserInfo'
import headDefaultImg from '../../../assets/head.png'
import { uploadimgService } from '../../../services/user'
import useLoadUserData from '../../../hooks/useLoadUserData'
import AvatarEditor from './avatarEditorElem'
import { sendEmailCode, verifyCodeService, updateUserInfoService } from '../../../services/user'
import { useRequest } from 'ahooks'

const { Dragger } = Upload

const Profile: FC = () => {
	const userId = getUserIdStorage()
	const { run } = useLoadUserData()
	const { username, nickname, headImg, email, created_at } = useGetUserInfo()
	// 控制上传头像的modal
	const [isShowUploadModel, setIsShowUploadModal] = useState(false)
	// 上传头像的modal确认按钮是否禁用
	const [isDisabledOkBtn, setIsDisabledOkBtn] = useState(true)
	// 获取的图片文件
	const [imgFile, setImgFile] = useState<UploadFile | null>()
	// 图片的本地url
	const [imageUrl, setImageUrl] = useState<string>()
	// 从数据库获取的图片url
	const [uploading, setUploading] = useState(false)
	// 裁剪后的图片
	const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
	// 发送验证码后的秒数和是否禁用
	const [secondsRemaining, setSecondsRemaining] = useState(60)
	const [isDisabledSendBtn, setIsDisabledSendBtn] = useState(false)
	const [sendEmailCodeLoading, setSendEmailCodeLoading] = useState(false)
	// 处理裁剪后的图片的函数
	function handleCroppedImage(croppedImageBlob: Blob | null) {
		if (croppedImageBlob) {
			setCroppedImage(croppedImageBlob)
		}
	}

	// upload的props
	const props: UploadProps = {
		beforeUpload: file => {
			const isJpgOrPng =
				file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
			if (!isJpgOrPng) {
				message.error('上传图片格式错误，请重新上传')
				return
			}
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				message.error('图片大小支持2M，请重新上传')
				return
			}
			setImgFile(file)
			const url = window.URL.createObjectURL(file as unknown as Blob)
			setImageUrl(url)
			setIsDisabledOkBtn(false)
			return false
		},
	}
	// 处理上传的函数
	async function handleUpload() {
		if (!imgFile) {
			console.error('No file selected for uploading.')
			return
		}

		const formData = new FormData()
		formData.append('imgFile', croppedImage as unknown as Blob)

		setUploading(true)
		try {
			await uploadimgService(userId, formData, 'headImg')
			run(Number(userId))
			message.success('头像上传成功')
		} catch (error) {
			console.error('上传头像失败:', error)
			message.error('头像上传失败，请稍后再试')
		} finally {
			setUploading(false)
		}

		// 当上传完成（无论成功与否）时，关闭模态框
		setIsShowUploadModal(false)
		setImageUrl('')
	}

	function handleModalCancel() {
		setIsShowUploadModal(false)
		setImgFile(null)
		setImageUrl('')
		setIsDisabledOkBtn(true)
	}

	const Basic: FC = () => {
		const [basicForm] = Form.useForm()
		// 邮箱的验证规则
		function validateEmail(_: any, value: any) {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return !value || emailPattern.test(value)
				? Promise.resolve()
				: Promise.reject(new Error('请输入有效的邮箱地址'))
		}

		// 点击发送邮件执行60s定时器60s后才能用
		let timer: any
		function timer60() {
			setIsDisabledSendBtn(true)
			timer = setInterval(() => {
				if (secondsRemaining > 0) {
					setSecondsRemaining(prevSeconds => prevSeconds - 1)
				}
			}, 1000)
		}

		// useEffect(() => {
		// 	if (secondsRemaining === 0) {
		// 		clearInterval(timer)
		// 		setIsDisabledSendBtn(false)
		// 		setSecondsRemaining(60)
		// 	}
		// }, [secondsRemaining])

		const { run: sendEmailCodeFun, loading: sendEmailCodeLoading } = useRequest(
			async (email: string) => {
				await sendEmailCode(email)
			},
			{
				manual: true,
				onSuccess: () => {
					message.success('已发送验证码，请注意查收')
					timer60()
				},
			},
		)

		// 邮箱发送验证码
		async function handleSendEmailCode() {
			basicForm
				.validateFields(['email'])
				.then(async () => {
					const email = basicForm.getFieldValue('email')
					try {
						// setSendEmailCodeLoading(true)
						const res = await sendEmailCode(email)
						if (res) {
							// setSendEmailCodeLoading(false)
							message.success('已发送验证码，请注意查收')
							// timer60()
						}
					} catch (error) {
						console.error('error', error)
						message.error('发送邮件失败')
					}
				})
				.catch(error => {
					console.error('error', error)
				})
		}

		function handleSavaBasic() {
			basicForm
				.validateFields()
				.then(async values => {
					const { nickname, email, captcha } = values
					const verifyRes = await verifyCodeService(email, captcha)
					if (!verifyRes) {
						message.error('验证码有误，请重新输入')
						return
					}
					const updateInfoRes = await updateUserInfoService(email, nickname)
					if (!updateInfoRes) {
						message.error('更新信息失败，请稍后再试')
						return
					}
					message.success('更新信息成功')
				})
				.catch((error: any) => {
					console.warn('error', error)
				})
		}

		return (
			<Form
				style={{ marginTop: '24px' }}
				initialValues={{ nickname, email }}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 16 }}
				form={basicForm}
				onFinish={handleSavaBasic}
			>
				<Form.Item
					label="用户昵称"
					name="nickname"
					rules={[{ required: true, message: '用户昵称不能为空' }]}
				>
					<Input size="large" />
				</Form.Item>
				<Form.Item
					label="邮箱"
					name="email"
					rules={[{ required: true, message: '邮箱不能为空' }, { validator: validateEmail }]}
				>
					<Input size="large" />
				</Form.Item>

				{
					<Form.Item
						label="验证码"
						name="captcha"
						rules={[{ required: true, message: '验证码不能为空' }]}
					>
						<Space>
							<Input size="large" />

							<Button
								type="primary"
								onClick={handleSendEmailCode}
								disabled={isDisabledSendBtn}
								loading={sendEmailCodeLoading}
							>
								{isDisabledSendBtn ? `${secondsRemaining} 秒后重新发送` : '发送验证码'}
							</Button>
						</Space>
					</Form.Item>
				}

				<Form.Item wrapperCol={{ offset: 4, span: 16 }}>
					<Space>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button type="primary" danger htmlType="submit">
							取消
						</Button>
					</Space>
				</Form.Item>
			</Form>
		)
	}
	const items = [
		{
			key: 'basic',
			label: '基本资料',
			children: <Basic />,
		},
		{
			key: 'bind',
			label: '绑定登录',
			children: 'Content of Tab Pane 2',
		},
		{
			key: 'update',
			label: '修改密码',
			children: 'Content of Tab Pane 3',
		},
	]
	return (
		<div className={styles['profile-wrapper']}>
			<div className={styles['profile-left']}>
				<div>个人信息</div>
				<Divider className={styles.divider} />
				<div className={styles['headImg']}>
					<img src={headImg || headDefaultImg} alt="" />
					<Button style={{ marginLeft: '15px' }} onClick={() => setIsShowUploadModal(true)}>
						上传头像
					</Button>
					<Modal
						title="上传头像"
						open={isShowUploadModel}
						onOk={handleUpload}
						onCancel={handleModalCancel}
						okButtonProps={{ disabled: isDisabledOkBtn }}
						okText="确认"
						cancelText="取消"
						confirmLoading={uploading}
						width="680px"
						styles={{
							body: {
								minHeight: '250px',
								// maxHeight: '300px',
							},
						}}
					>
						<div style={{ height: '250px', width: '100%', userSelect: 'none' }}>
							{imageUrl ? (
								// <img
								// 	src={imageUrl}
								// 	alt="Preview Image"
								// 	style={{ width: '100%', height: '100%', objectFit: 'contain' }}
								// />.

								<AvatarEditor imageUrl={imageUrl} onCroppedImage={handleCroppedImage} />
							) : (
								<Dragger {...props}>
									<div
										style={{
											height: '200px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<p className="ant-upload-drag-icon">
											<InboxOutlined />
										</p>
										<p>点击或拖拽上传图片（支持jpg/jpeg/png，图片大小限制2M）</p>
									</div>
								</Dragger>
							)}
						</div>
					</Modal>
				</div>
				<Divider className={styles.divider} />
				<div className={styles.info}>
					<div className={styles['info-item']}>
						<span>账号</span>
						<span>{username}</span>
					</div>
					<Divider className={styles.divider} />
					<div className={styles['info-item']}>
						<span>用户昵称</span>
						<span>{nickname}</span>
					</div>
					<Divider className={styles.divider} />
					<div className={styles['info-item']}>
						<span>用户邮箱</span>
						<span>{email}</span>
					</div>
					<Divider className={styles.divider} />
					<div className={styles['info-item']}>
						<span>创建时间</span>
						<span>{moment(created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
					</div>
				</div>
			</div>
			<div className={styles['profile-right']}>
				<Tabs defaultActiveKey="1" items={items} />
			</div>
		</div>
	)
}

export default Profile
