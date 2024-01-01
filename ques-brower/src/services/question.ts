import http, { ResDataType } from './http'
import API from './api'

type SearchType = {
	userId: string
	keyword?: string
	isStar?: boolean
	isDeleted?: boolean
	page?: number
	pageSize?: number
}

// 创建问卷 返回ID
async function createQuesService(title: string, userId: number): Promise<ResDataType> {
	const data = await http.post(API.SURVEYS.createQues, {
		title,
		userId,
	})
	return data
}

//获取某个问卷的全部信息
async function getQuesInfoService(id: number): Promise<ResDataType> {
	const data = await http.get(API.SURVEYS.getOneQues + id)
	return data
}

// 获取某个用户的全部问卷
async function getAllQuestionListService(
	id: number,
	page?: number,
	pageSize?: number,
): Promise<ResDataType> {
	const data = await http.get(API.SURVEYS.questionList, {
		params: {
			userId: id,
			page,
			pageSize,
		},
	})
	return data
}

// 获取搜索，分页的问卷
async function getSearchQuesListService(props: SearchType): Promise<ResDataType> {
	const data = await http.get(API.SURVEYS.searchQues, {
		params: props,
	})
	return data
}

// 获取星标问卷
async function getStarQuesService(
	id: string,
	page?: number,
	pageSize?: number,
): Promise<ResDataType> {
	const data = await http.get(API.SURVEYS.quesStar, {
		params: {
			userId: id,
			isStar: true,
			page,
			pageSize,
		},
	})
	return data
}

// 获取回收站里面的问卷
async function getTrashQuesService(
	id: string,
	page?: number,
	pageSize?: number,
): Promise<ResDataType> {
	const data = await http.get(API.SURVEYS.quesDel, {
		params: {
			userId: id,
			isDeleted: true,
			page,
			pageSize,
		},
	})
	return data
}

export {
	createQuesService,
	getQuesInfoService,
	getAllQuestionListService,
	getSearchQuesListService,
	getStarQuesService,
	getTrashQuesService,
}
