import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import useGetUserinfo from './useGetUserInfo'
import { getUserInfoService } from '../services/user'
import { getUserIdStorage } from '../utools/user-storage'
import { loginReducer } from '../store/userReducer'

function useLoadUserData() {
	const dispatch = useDispatch()
	const [waitingUserData, setWaitingUserData] = useState(true)
	const { username, headImg } = useGetUserinfo()
	const userId = getUserIdStorage()

	const { run } = useRequest(getUserInfoService, {
		manual: true,
		onSuccess(res) {
			const { username, nickname, headImg, email, created_at } = res
			dispatch(loginReducer({ username, nickname, headImg, email, created_at }))
		},
		onFinally() {
			setWaitingUserData(false)
		},
	})

	useEffect(() => {
		if (username) {
			setWaitingUserData(false)
			return
		}
		if (userId) {
			run(parseInt(userId))
		}
	}, [username, headImg])

	return { waitingUserData, run }
}

export default useLoadUserData
