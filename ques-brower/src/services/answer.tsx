import http, { ResDataType } from './http'
import API from './api'

async function getAnswers(surveyId: string): Promise<ResDataType> {
	const data = await http.get(API.ANSWER.getSingleAnswers + surveyId)
	return data
}

export { getAnswers }
