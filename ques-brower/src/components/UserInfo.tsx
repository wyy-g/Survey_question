import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import styles from './UserInfo.module.scss'
import { LOGIN_PATHNAME } from '../router'

type PropsType = {
	username?: string
	nickname?: string
	headImg?: string
}

const UserInfo: FC<PropsType> = props => {
	const { username, headImg } = props
	return (
		<>
			{username ? (
				<div>
					<div className={styles['headImg']}>
						<img src={headImg ? headImg : '.../assets/head.png'} alt="" />
					</div>
					<span>{username}</span>
				</div>
			) : (
				<Link to={LOGIN_PATHNAME}>去登录</Link>
			)}
			{/* <Link to={LOGIN_PATHNAME}>去登录</Link> */}
		</>
	)
}

export default UserInfo
