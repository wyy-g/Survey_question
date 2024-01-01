import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'

import { getSearchQuesListService } from '../services/question'

type OptionsType = {
	isStar?: boolean
	isDeleted?: boolean
	page?: number
	pageSize?: number
}

const useLoadSearchQues = (opt: Partial<OptionsType>) => {
	const { isDeleted, isStar } = opt
	const [searchParams] = useSearchParams()
	const keyword = searchParams.get('keyword') || ''
	const { data, loading, error } = useRequest(
		async () => {
			const page = parseInt(searchParams.get('page') || '') || 1
			const pageSize = parseInt(searchParams.get('pageSize') || '') || 4
			const data = await getSearchQuesListService({
				userId: '62',
				keyword,
				isDeleted,
				isStar,
				page,
				pageSize,
			})
			return data
		},
		{ refreshDeps: [keyword] },
	)
	return { data, loading, error }
}

export default useLoadSearchQues
