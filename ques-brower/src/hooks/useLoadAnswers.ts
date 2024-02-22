import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'

import { resetAnswers } from '../store/answerReducer'
import { getAnswers } from '../services/answer'

export default function useLoadAnswers() {
	const { id = '' } = useParams()
	const dispatch = useDispatch()

	const { data, loading } = useRequest(async () => await getAnswers(id))
	return {
		data,
		loading,
	}
}
