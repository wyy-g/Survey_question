import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'

import styles from './mainLayout.module.scss'
import UserInfo from '../components/UserInfo'
import useLoadUserData from '../hooks/useLoadUserData'
import useRouteGuard from '../hooks/useRouteGuard'

const { Header, Content } = Layout

const MainLayout: FC = () => {
	const { waitingUserData } = useLoadUserData()
	useRouteGuard()
	return (
		<Layout>
			<Header className={styles['header']}>
				<div className={styles['logo']}> </div>

				<div className={styles['right']}>
					<div className={styles['info']}>{<UserInfo />}</div>
				</div>
			</Header>
			<Content className={styles['content']}>{!waitingUserData && <Outlet />}</Content>
			{/* <Footer>MainLayout Footer</Footer> */}
		</Layout>
	)
}

export default MainLayout
