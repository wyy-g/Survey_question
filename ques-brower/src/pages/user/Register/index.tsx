import React, { FC } from 'react'
import { Input, Button, Form, message } from 'antd'
import { UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'

import styles from './register.module.scss'
import { registerService } from '../../../services/user'
import { LOGIN_PATHNAME } from '../../../router'

const Register: FC = () => {
	const nav = useNavigate()
	const { run } = useRequest(
		async values => {
			const { username, password, confirm } = values
			await registerService(username, password, confirm)
		},
		{
			manual: true,
			onSuccess() {
				message.success('注册成功')
				nav(LOGIN_PATHNAME)
			},
		},
	)
	function onFinish(values: any) {
		run(values)
	}
	return (
		<div className={styles['container']}>
			<div className={styles['form']}>
				<Form onFinish={onFinish}>
					<Form.Item
						name="username"
						rules={[
							{ required: true, message: '账户不能为空' },
							{ type: 'string', min: 6, max: 15, message: '字符长度必须在6-15之间' },
							{ pattern: /^\w+$/, message: '只能是字母数字下划线' },
						]}
					>
						<Input placeholder="请输入你的账户" prefix={<UserOutlined />} size="large" />
					</Form.Item>
					<Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
						<Input.Password placeholder="请输入密码" prefix={<LockOutlined />} size="large" />
					</Form.Item>
					<Form.Item
						name="confirm"
						dependencies={['password']}
						rules={[
							{ required: true, message: '确认密码不能为空密码' },
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
						<Input.Password placeholder="请再次输入密码" prefix={<UnlockOutlined />} size="large" />
					</Form.Item>
					<Form.Item name="confirm">
						<Button
							type="primary"
							size="large"
							htmlType="submit"
							className={styles['register-btn']}
						>
							注册
						</Button>
					</Form.Item>
				</Form>
				<div className={styles['protocol']}>
					点击「注册」表示已阅读并同意
					<Button type="link" style={{ padding: '0 4px', fontWeight: 500 }}>
						服务条款
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Register
