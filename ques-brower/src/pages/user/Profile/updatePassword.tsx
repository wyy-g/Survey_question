import React, { FC, useState, useEffect } from 'react'
import { Form, Input, Button, Space, message } from 'antd'
import useGetUserInfo from '../../../hooks/useGetUserInfo'
import validateEmail from '../../../utools/validateEmail'
import { sendEmailCode, verifyCodeService } from '../../../services/user'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateUserPwdService } from '../../../services/user'
import { useDispatch } from 'react-redux'
import { logoutReducer } from '../../../store/userReducer'
import { removeToken, removeUserId } from '../../../utools/user-storage'

const updatePassword: FC = () => {
	const { email } = useGetUserInfo()
	const [updatePassForm] = Form.useForm()
	// 发送验证码后的秒数和是否禁用
	const [secondsRemaining, setSecondsRemaining] = useState(60)
	const [isDisabledSendBtn, setIsDisabledSendBtn] = useState(false)
	const { pathname } = useLocation()
	const nav = useNavigate()
	const dispatch = useDispatch()

	// 点击发送邮件执行60s定时器60s后才能用
	let timer: any
	// 修改timer60函数如下
	function timer60() {
		setIsDisabledSendBtn(true)
		setSecondsRemaining(60)
		timer = setInterval(() => {
			setSecondsRemaining(prevSeconds => {
				if (prevSeconds > 0) {
					return prevSeconds - 1
				} else {
					// 这里不再需要额外处理，交给上面的useEffect处理
					return prevSeconds
				}
			})
		}, 1000)
	}

	useEffect(() => {
		if (secondsRemaining === 0) {
			clearInterval(timer)
			timer = null
			setIsDisabledSendBtn(false)
		}
	}, [secondsRemaining])

	useEffect(() => {
		return () => {
			if (timer) clearInterval(timer)
		}
	}, [])

	// 邮箱发送验证码
	async function handleSendEmailCode() {
		updatePassForm
			.validateFields(['email'])
			.then(async () => {
				const email = updatePassForm.getFieldValue('email')
				try {
					// setSendEmailCodeLoading(true)
					const res = await sendEmailCode(email)
					if (res) {
						// setSendEmailCodeLoading(false)
						message.success('已发送验证码，请注意查收')
						timer60()
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

	function handleSava() {
		updatePassForm
			.validateFields()
			.then(async values => {
				const { password, confirmPwd, email, captcha } = values
				const verifyRes = await verifyCodeService(email, captcha)
				if (!verifyRes) {
					message.error('验证码有误，请重新输入')
					return
				}

				await updateUserPwdService(email, password, confirmPwd)

				if (pathname === '/user/findBackPassword') {
					message.success('密码成功找回，请登录')
				} else {
					dispatch(logoutReducer())
					removeToken()
					removeUserId()
					message.success('修改密码成功，请重新登录')
				}
				nav('/user/login')
			})
			.catch((error: any) => {
				console.warn('error', error)
			})
	}

	return (
		<Form
			style={{ marginTop: '20px' }}
			initialValues={{ email }}
			labelCol={{ span: pathname === '/user/findBackPassword' ? 6 : 4 }}
			wrapperCol={{ span: 16 }}
			form={updatePassForm}
			onFinish={handleSava}
		>
			<Form.Item
				label="邮箱"
				name="email"
				rules={[{ required: true, message: '邮箱不能为空' }, { validator: validateEmail }]}
			>
				<Input size="large" />
			</Form.Item>
			<Form.Item
				label="验证码"
				name="captcha"
				rules={[{ required: true, message: '验证码不能为空' }]}
			>
				<Space>
					<Input size="large" />

					<Button type="primary" onClick={handleSendEmailCode} disabled={isDisabledSendBtn}>
						{isDisabledSendBtn ? `${secondsRemaining} 秒后重新发送` : '发送验证码'}
					</Button>
				</Space>
			</Form.Item>
			<Form.Item
				label="新密码"
				name="password"
				rules={[{ required: true, message: '新密码不能为空' }]}
			>
				<Input.Password size="large" />
			</Form.Item>
			<Form.Item
				label="确认密码"
				name="confirmPwd"
				rules={[
					{ required: true, message: '确认密码不能为空' },
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve()
							} else {
								return Promise.reject(new Error('两次密码不一致'))
							}
						},
					}),
				]}
			>
				<Input.Password size="large" />
			</Form.Item>
			<Form.Item wrapperCol={{ offset: pathname === '/user/findBackPassword' ? 6 : 4, span: 16 }}>
				<Space>
					<Button type="primary" htmlType="submit" style={{ padding: '0 50px' }}>
						{pathname === '/user/findBackPassword' ? '确认' : '保存'}
					</Button>
				</Space>
			</Form.Item>
		</Form>
	)
}

export default updatePassword
