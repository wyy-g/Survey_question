import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useRequest } from 'ahooks'

import styles from './UserInfo.module.scss'
import { LOGIN_PATHNAME } from '../router'
import { getUserInfoService } from '../services/user'
import headDefaultImg from '../assets/head.png'

type PropsType = {
	username?: string
	nickname?: string
	headImg?: string
}

const UserInfo: FC<PropsType> = props => {
	const { data = {} } = useRequest(getUserInfoService)
	const { nickname, username, headImg = '' } = data
	return (
		<>
			{
				<div className={styles['container']}>
					<div className={styles['headImg']}>
						<img src={headImg || headDefaultImg} alt="" />
					</div>
					<span>{nickname || username}</span>
				</div>
			}
			{/* <Link to={LOGIN_PATHNAME}>去登录</Link> */}
		</>
	)
}

export default UserInfo
