import http, { ResDataType } from './http'
import API from './api'

async function getAnswers(
	surveyId: string,
	start_time?: string,
	end_time?: string,
): Promise<ResDataType> {
	const data = await http.get(API.ANSWER.getSingleAnswers + surveyId, {
		params: {
			start_time,
			end_time,
		},
	})
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

// 提交反馈
async function submitFeedback(opt: { [key: string]: any }): Promise<ResDataType> {
	const data = await http.post(API.ANSWER.feedback + opt.survey_id, opt)
	return data
}

// 获取反馈
async function getFeedback(survey_id: number): Promise<ResDataType> {
	const data = await http.get(API.ANSWER.feedback + survey_id)
	return data
}

// 删除反馈
async function delFeedback(survey_id: number): Promise<ResDataType> {
	const data = await http.delete(API.ANSWER.feedback + survey_id)
	return data
}

// 答案为上传文件
async function uploadAnswersFileApi(
	surveyId: string,
	formData: FormData,
	type?: string,
): Promise<ResDataType> {
	const data = await http.post(API.ANSWER.uploadFile, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		params: {
			surveyId,
			type,
		},
	})
	return data
}

export {
	getAnswers,
	deleteAnswers,
	submitAnswers,
	downloadTable,
	submitFeedback,
	getFeedback,
	delFeedback,
	uploadAnswersFileApi,
}
