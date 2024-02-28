import http, { ResDataType } from './http'
import API from './api'

async function getAnswers(surveyId: string): Promise<ResDataType> {
	const data = await http.get(API.ANSWER.getSingleAnswers + surveyId)
	return data
}

// 批量删除答案
async function deleteAnswers(ids: string[] | number[]): Promise<ResDataType> {
	const data = await http.delete(API.ANSWER.delAnswer, {
		data: { ids },
	})
	return data
}

// 提交答案
async function submitAnswers(opt: { [key: string]: any }): Promise<ResDataType> {
	const data = await http.post(API.ANSWER.submitAnswer, opt)
	return data
}

// 下载表格
async function downloadTable(surveyId: string): Promise<ResDataType> {
	const data = await http.get(API.ANSWER.downloadExcel + surveyId, { responseType: 'blob' })
	return data
}

export { getAnswers, deleteAnswers, submitAnswers, downloadTable }
