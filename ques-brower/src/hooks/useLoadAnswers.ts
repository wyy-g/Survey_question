import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { useEffect } from 'react'

import { getAnswers } from '../services/answer'

export default function useLoadAnswers() {
	const { id = '' } = useParams()

	const { run, loading, data } = useRequest(async () => await getAnswers(id), { manual: true })
	useEffect(() => {
		run()
	}, [])
	return {
		run,
		data,
		loading,
	}
}
