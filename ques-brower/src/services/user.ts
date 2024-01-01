import http, { ResDataType } from './http'
import API from './api'

// 获取用户信息
async function getUserInfoService(username: string): Promise<ResDataType> {
	const data = (await http.get(API.USER.info, {
		params: {
			username,
		},
	})) as ResDataType
	return data
}

//注册用户
async function registerService(
	username: string,
	password: string,
	confirmPwd: string,
): Promise<ResDataType> {
	const data = await http.post(API.USER.register, {
		username,
		password,
		confirmPwd,
	})
	return data
}

// 登录

async function loginService(username: string, password: string): Promise<ResDataType> {
	const data = await http.post(API.USER.login, {
		username,
		password,
	})
	return data
}

export { getUserInfoService, registerService, loginService }
