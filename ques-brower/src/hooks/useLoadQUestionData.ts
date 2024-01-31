import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'

import { resetComponents } from '../store/componentReducer'
import { getQuesInfoService } from '../services/question'
import { resetPageInfo } from '../store/pageInfoReducer'

function useLoadQuestionData() {
	const { id = '' } = useParams()
	const dispatch = useDispatch()

	const { data, error, loading, run } = useRequest(
		async (id: string) => {
			if (!id) return
			const data = await getQuesInfoService(Number(id))
			return data
		},
		{
			manual: true,
		},
	)

	useEffect(() => {
		if (!data) return
		const { title = '', description, isShowOrderIndex, componentList = [] } = data
		//获取默认选中的selected
		let selectId = ''
		if (componentList.length > 0) {
			selectId = componentList[0].id
		}
		dispatch(resetComponents({ selectId, componentList }))
		dispatch(resetPageInfo({ title, isShowOrderIndex, description }))
	}, [data])

	useEffect(() => {
		run(id)
	}, [id])

	return {
		error,
		loading,
	}
}

export default useLoadQuestionData
