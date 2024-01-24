import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

const Home: FC = () => {
	const nav = useNavigate()
	useEffect(() => {
		async function fn() {
			// const data = await getUserInfoService('admin123')
			// console.log('userinfo', data)
		}
		fn()
	}, [])
	return <div> </div>
}

export default Home
