import http, { ResDataType } from './http'
import API from './api'

async function getFeedNotifications(userId: string): Promise<ResDataType> {
	const data = await http.get(API.FEEDBACKNOTIFICARION + userId)
	return data
}

async function delFeedNoticifation(notification_id: number | string): Promise<ResDataType> {
	const data = await http.delete(API.FEEDBACKNOTIFICARION + notification_id)
	return data
}

async function updateFeedbackNoticifation(notification_id: number | string): Promise<ResDataType> {
	const data = await http.patch(API.FEEDBACKNOTIFICARION + notification_id)
	return data
}

export { getFeedNotifications, delFeedNoticifation, updateFeedbackNoticifation }
