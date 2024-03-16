import React, { FC, useEffect } from 'react'
import { Input, Button, Checkbox, Form, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'

import styles from './login.module.scss'
import { loginService } from '../../../services/user'
import { MANAGE_INDEX_PATHNAME } from '../../../router'
import { setToken, setUserId } from '../../../utools/user-storage'

const USERNAME_KEY = 'USERNAME'
const PASSWORD_KEY = 'PASSWORD'

function rememberUser(username: string, password: string) {
	localStorage.setItem(USERNAME_KEY, username)
	localStorage.setItem(PASSWORD_KEY, password)
}

function delUserFromStorage() {
	localStorage.removeItem(USERNAME_KEY)
	localStorage.removeItem(PASSWORD_KEY)
}

function getUserInfoFromStorage() {
	return {
		username: localStorage.getItem(USERNAME_KEY),
		password: localStorage.getItem(PASSWORD_KEY),
	}
}

const Login: FC = () => {
	const nav = useNavigate()
	const { run } = useRequest(
		async values => {
			const { username, password } = values
			const data = await loginService(username, password)
			return data
		},
		{
			manual: true,
			onSuccess(result) {
				const { token, userId } = result
				setToken(token)
				setUserId(userId)
				message.success('登录成功')
				nav(MANAGE_INDEX_PATHNAME)
			},
		},
	)

	const [form] = Form.useForm()
	useEffect(() => {
		const { username, password } = getUserInfoFromStorage()
		form.setFieldsValue({ username, password })
	}, [])

	function onFinish(values: any) {
		run(values)
		if (values.remember) {
			rememberUser(values.username, values.password)
		} else {
			delUserFromStorage()
		}
	}

	return (
		<div className={styles['container']}>
			<div className={styles['form']}>
				<Form onFinish={onFinish} form={form}>
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
					<Form.Item name="remember" valuePropName="checked">
						<div className={styles['remenberOrforget']}>
							<Checkbox>记住账号</Checkbox>
							<div className={styles['forget-pwd']}>
								·
								<Button type="link" style={{ padding: '0 4px', fontWeight: 500 }}>
									忘记密码？
								</Button>
							</div>
						</div>
					</Form.Item>
					<Form.Item>
						<Button type="primary" size="large" htmlType="submit" className={styles['singin']}>
							登录
						</Button>
					</Form.Item>
				</Form>

				<div className={styles['protocol']}>
					点击「登录」表示已阅读并同意
					<Button type="link" style={{ padding: '0 4px', fontWeight: 500 }}>
						服务条款
					</Button>
				</div>
				<div className={styles['login-other']}>
					<div className={styles['divider']}>
						<span className={styles['other']}>其他方式</span>
						<i></i>
					</div>
					<div className={styles['other-button']}>
						<Button type="default" size="large" className={styles['weixin']}>
							微信登录
						</Button>
						<Button type="default" size="large" className={styles['qq']}>
							QQ
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
