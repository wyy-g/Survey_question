import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { getUserInfoService } from '../services/user'

const Home: FC = () => {
	const nav = useNavigate()
	useEffect(() => {
		async function fn() {
			const data = await getUserInfoService('admin123')
			console.log('userinfo', data)
		}
		fn()
	}, [])
	return (
		<div>
			<p>Home</p>
			<Button type="primary">antd</Button>
			<button onClick={() => nav('/login')}>登录</button>
		</div>
	)
}

export default Home
