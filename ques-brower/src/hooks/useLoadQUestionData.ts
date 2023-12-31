// import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'

import { getQuesInfoService } from '../services/question'

function useLoadQuestionData() {
	const { id } = useParams()
	// const [loading, setLoading] = useState(true)
	// const [questionData, setQuestionData] = useState({})
	// useEffect(() => {
	// 	;(async function () {
	// 		const data = await getQuesInfoService(Number(id))
	// 		console.log(data)

	// 		setQuestionData(data)
	// 		setLoading(false)
	// 	})()
	// }, [])
	// return {
	// 	loading,
	// 	questionData,
	// }

	async function loadData() {
		const data = await getQuesInfoService(Number(id))
		return data
	}

	const { data, error, loading } = useRequest(loadData)
	return {
		data,
		error,
		loading,
	}
}

export default useLoadQuestionData
