import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import { getToekn, getUserIdStorage } from '../utools/user-storage'
import API from './api'
import { LOGIN_PATHNAME } from '../router'

const instance = axios.create({
	timeout: 10 * 500,
})

const getUserId = () => {
	const userId = getUserIdStorage()
	return userId
}

// 请求拦截器
instance.interceptors.request.use(
	config => {
		const userId = getUserId()
		// 携带token
		config.headers['Authorization'] = `Bearer ${getToekn()}`
		// 每个请求都要携带userId
		if (userId && config.url !== API.USER.login && config.url !== API.USER.register) {
			// if (config.method == 'GET') {
			config.headers['x-user-id'] = userId
			// 	console.log(123)
			// } else if (config.method == 'POST') {
			// 	config.data = { ...config.data, userId }
			// }
		}
		return config
	},
	error => Promise.reject(error),
)

// 响应拦截器
instance.interceptors.response.use(
	res => {
		const resData = (res.data || {}) as ResType
		const { code, data, msg } = resData

		if (code !== 200) {
			// 错误提示
			if (msg) {
				message.error(msg)
			}
			throw new Error(msg)
		}

		return data as any
	},
	error => {
		if (error.response) {
			// const nav = useNavigate()
			if (error.response.data.code === 401) {
				console.log('token')
				// window.location.replace(LOGIN_PATHNAME)
			}
			message.error(error.response.data.msg)
		}
	},
)

export default instance

export type ResType = {
	code: number
	data?: ResDataType
	msg?: string
}

export type ResDataType = {
	[key: string]: any
}
