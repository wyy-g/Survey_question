import React, { FC } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'antd'

import styles from './mainLayout.module.scss'
import UserInfo from '../components/UserInfo'
import useLoadUserData from '../hooks/useLoadUserData'
import useRouteGuard from '../hooks/useRouteGuard'
import Home from '../pages/Home'
import { getUserIdStorage } from '../utools/user-storage'
import Inform from '../components/inform'

const { Header, Content } = Layout

const MainLayout: FC = () => {
	const { waitingUserData } = useLoadUserData()
	const userId = getUserIdStorage()
	useRouteGuard()
	return (
		<Layout>
			<Header className={styles['header']}>
				<div className={styles['logo']}> </div>

				<div className={styles['right']}>
					<Inform />
					<div className={styles['info']}>{<UserInfo />}</div>
				</div>
			</Header>
			<Content className={styles['content']}>{userId ? <Outlet /> : <Home />}</Content>
		</Layout>
	)
}

export default MainLayout
