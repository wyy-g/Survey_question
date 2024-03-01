import { useSelector } from 'react-redux'
import { StateType } from '../store'
import { UserStateType } from '../store/userReducer'

export default function useGetUserInfo() {
	const { username, nickname, headImg, email, created_at } = useSelector<StateType>(
		state => state.user,
	) as UserStateType
	return {
		username,
		nickname,
		headImg,
		email,
		created_at,
	}
}
