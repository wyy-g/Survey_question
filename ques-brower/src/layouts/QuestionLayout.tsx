import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import useRouteGuard from '../hooks/useRouteGuard'
import useLoadUserData from '../hooks/useLoadUserData'
import Header from './QuestionHeader'

const QuestionLayout: FC = () => {
	const { waitingUserData } = useLoadUserData()
	useRouteGuard(waitingUserData)
	return (
		<div style={{ height: '100vh' }}>
			<Header />
			<div style={{ height: 'calc(100vh - 55px)' }}>
				<Outlet />
			</div>
		</div>
	)
}

export default QuestionLayout
