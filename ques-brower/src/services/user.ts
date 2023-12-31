import http, { ResDataType } from './http'
import API from './api'

async function getUserInfoService(username: string): Promise<ResDataType> {
	const data = (await http.get(API.USER.info, {
		params: {
			username,
		},
	})) as ResDataType
	return data
}

export { getUserInfoService }
