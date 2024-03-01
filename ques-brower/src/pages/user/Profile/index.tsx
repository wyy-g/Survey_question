import React, { FC, useState } from 'react'
import { Divider, Button, Tabs, Form, Input, Space, Modal, Upload, message } from 'antd'
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

const { Dragger } = Upload

const Profile: FC = () => {
	const userId = getUserIdStorage()

	const { username, nickname, headImg, email, created_at } = useGetUserInfo()
	// 控制上传头像的modal
	const [isShowUploadModel, setIsShowUploadModal] = useState(false)
	// 上传头像的modal确认按钮是否禁用
	const [isDisabledOkBtn, setIsDisabledOkBtn] = useState(true)
	// 获取的图片文件
	const [imgFile, setImgFile] = useState<UploadFile | null>()
	// 图片的本地url
	const [imageUrl, setImageUrl] = useState<string>()
	const [uploading, setUploading] = useState(false)
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

		// 确保 imgFile 包含 Blob 对象
		// const fileBlob = imgFile.originFileObj | undefined
		// if (!fileBlob) {
		// 	console.error('Failed to extract Blob from imgFile.')
		// 	return
		// }

		const formData = new FormData()
		formData.append('imgFile', imgFile as unknown as Blob)

		setUploading(true)
		try {
			await uploadimgService(userId, formData, 'headImg')
			message.success('头像上传成功')
		} catch (error) {
			console.error('上传头像失败:', error)
			message.error('头像上传失败，请稍后再试')
		} finally {
			setUploading(false)
		}

		// 当上传完成（无论成功与否）时，关闭模态框
		setIsShowUploadModal(false)
	}

	function handleModalCancel() {
		setIsShowUploadModal(false)
		setImgFile(null)
		setImageUrl('')
		setIsDisabledOkBtn(true)
	}

	const Basic: FC = () => {
		return (
			<Form
				style={{ marginTop: '24px' }}
				initialValues={{ nickname, email }}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 16 }}
			>
				<Form.Item
					label="用户昵称"
					name="nickname"
					rules={[{ required: true, message: '用户昵称不能为空' }]}
				>
					<Input size="large" />
				</Form.Item>
				<Form.Item label="邮箱" name="email" rules={[{ required: true, message: '邮箱不能为空' }]}>
					<Input size="large" />
				</Form.Item>
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
							},
						}}
					>
						<div>
							{imageUrl ? (
								<img src={imageUrl} alt="Preview Image" style={{ maxWidth: '100%' }} />
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
