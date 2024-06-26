import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Space, message, notification } from 'antd'
import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styles from './UserInfo.module.scss'
import { LOGIN_PATHNAME } from '../router'
import headDefaultImg from '../assets/head.png'
import { removeToken, removeUserId } from '../utools/user-storage'
import useGetUserInfo from '../hooks/useGetUserInfo'
import { logoutReducer } from '../store/userReducer'
import { getUserIdStorage } from '../utools/user-storage'

const UserInfo: FC = () => {
	const nav = useNavigate()
	const dispatch = useDispatch()
	const { nickname, username, headImg, email } = useGetUserInfo()
	const userId = getUserIdStorage()
	const onClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'logout') {
			dispatch(logoutReducer())
			removeToken()
			removeUserId()
			message.success('退出成功')
			nav(LOGIN_PATHNAME)
		}
	}

	// if (!email) {
	// 	notification.info({
	// 		message: '系统提示',
	// 		description: '未绑定邮箱，去绑定邮箱',
	// 		// onClick: () => {
	// 		// 	nav(`/question/stat/${messageData.survey_id}`)
	// 		// },
	// 	})
	// }
	const items: MenuProps['items'] = [
		{
			label: <Link to="/profile">个人信息</Link>,
			key: 'userInfo',
		},
		{
			type: 'divider',
		},
		{
			label: <span>退出登录</span>,
			key: 'logout',
		},
	]
	return (
		<>
			<div className={styles['container']}>
				{userId ? (
					<Dropdown trigger={['click']} menu={{ items, onClick }}>
						<Space>
							<div className={styles['headImg']}>
								<img src={headImg || headDefaultImg} alt="" />
							</div>
							<span>{nickname || username}</span>
							<a onClick={e => e.preventDefault()}>
								<DownOutlined />
							</a>
						</Space>
					</Dropdown>
				) : (
					<Link to="/user/login">去登录</Link>
				)}
			</div>
		</>
	)
}

export default UserInfo
