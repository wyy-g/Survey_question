const KEY = 'USER_TOKEN'
const UEER_ID = 'UEER_ID'

export function setToken(token: string) {
	localStorage.setItem(KEY, token)
}

export function getToekn() {
	return localStorage.getItem(KEY) || ''
}

export function removeToken() {
	localStorage.removeItem(KEY)
}

export function setUserId(userId: string) {
	localStorage.setItem(UEER_ID, userId)
}

export function getUserIdStorage() {
	return localStorage.getItem(UEER_ID) || ''
}

export function removeUserId() {
	localStorage.removeItem(UEER_ID)
}
