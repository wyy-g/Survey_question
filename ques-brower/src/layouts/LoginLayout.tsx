import React, { FC, useEffect } from 'react'
import { CheckCircleOutlined, RightCircleFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import commons from './loginLayout.module.scss'
import TyperWriter from '../utools/TyperWriterComponent'
import useRouteGuard from '../hooks/useRouteGuard'

const Login: FC = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()
	useRouteGuard()

	return (
		<>
			<div className={commons['container']}>
				<div className={commons['left']}>
					<div className={commons['desc']}>
						<TyperWriter
							time={250}
							text={
								'问卷包含多种题型，如单选题、多选题、开放性问题等，以便从不同角度收集您的意见和看法。'
							}
						></TyperWriter>
						<div className={commons['desc-supply']}>
							<span style={{ marginRight: '15px' }}>
								<Space>
									<CheckCircleOutlined color="#fff" />
									永久免费
								</Space>
							</span>
							<span style={{ marginRight: '15px' }}>
								<Space>
									<CheckCircleOutlined color="#fff" />
									实时在线
								</Space>
							</span>
							<span>
								<Space>
									<CheckCircleOutlined color="#fff" />
									设计/发布
								</Space>
							</span>
						</div>
					</div>
				</div>
				<div
					className={
						pathname === '/user/findBackPassword' ? commons['findBackPassword'] : commons['right']
					}
				>
					{pathname === '/user/findBackPassword' ? (
						<>
							<h2>找回密码</h2>
							<div style={{ marginBottom: '90px' }}>
								<Button
									type="link"
									onClick={() => nav('/user/login')}
									style={{ padding: '0 4px', fontWeight: 500 }}
								>
									去登录
									<RightCircleFilled style={{ color: '#4E89FF' }} />
								</Button>
								<Button
									type="link"
									onClick={() => nav('/user/register')}
									style={{ padding: '0 4px', fontWeight: 500 }}
								>
									去注册
									<RightCircleFilled style={{ color: '#4E89FF' }} />
								</Button>
							</div>
						</>
					) : (
						<div className={commons['title']}>
							<h2>{pathname === '/user/login' ? '登录' : '注册'}你的问卷账户</h2>
							<span className={commons['is-have-account']}>
								{pathname === '/user/login' ? '没有账户?' : '已有账户?'}
								{pathname === '/user/login' ? (
									<Button
										type="link"
										onClick={() => nav('/user/register')}
										style={{ padding: '0 4px', fontWeight: 500 }}
									>
										免费注册
										<RightCircleFilled style={{ color: '#4E89FF' }} />
									</Button>
								) : (
									<Button
										type="link"
										onClick={() => nav('/user/login')}
										style={{ padding: '0 4px', fontWeight: 500 }}
									>
										前去登录
										<RightCircleFilled style={{ color: '#4E89FF' }} />
									</Button>
								)}
							</span>
						</div>
					)}

					<Outlet></Outlet>
				</div>
			</div>
			<div className={commons['logo']}></div>
			<footer>
				@2023-2024 在线问卷调查毕业设计项目&nbsp;
				<Space>
					-<Link to="http://www.jstu.edu.cn/">江苏理工学院</Link>/
					<Link to="https://www.jsahvc.edu.cn/main.htm">江苏农牧职业技术学院</Link>
				</Space>
			</footer>
		</>
	)
}

export default Login
