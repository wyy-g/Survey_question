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
		const {
			title = '',
			description,
			isShowOrderIndex,
			componentList = [],
			isPublished,
			createdAt,
			updatedAt,
			startTime,
			endTime,
			isEnableFeedback,
			isMultiLang,
			lang,
			defaultLang,
		} = data
		//获取默认选中的selected
		let selectId = ''
		if (componentList.length > 0) {
			selectId = componentList[0].id
		}
		// 将传过来的lang 字符串转为数组
		const langArr = lang ? lang.split(',') : ['zh', 'en']
		dispatch(resetComponents({ selectId, componentList }))
		dispatch(
			resetPageInfo({
				title,
				isShowOrderIndex,
				description,
				isPublished,
				createdAt,
				updatedAt,
				startTime,
				endTime,
				isEnableFeedback,
				isMultiLang,
				lang: langArr,
				defaultLang: defaultLang ? defaultLang : 'zh',
			}),
		)
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
