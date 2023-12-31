import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'

import { getSearchQuesListService } from '../services/question'

type OptionsType = {
	isStar?: boolean
	isDeleted?: boolean
	offset?: number
	pageSize?: number
}

const useLoadSearchQues = (opt: Partial<OptionsType>) => {
	const { isDeleted, isStar } = opt
	const [searchParams] = useSearchParams()
	const { data, loading, error } = useRequest(
		async () => {
			const keyword = searchParams.get('keyword') || ''
			const offset = parseInt(searchParams.get('page') || '') || 1
			const pageSize = parseInt(searchParams.get('pageSize') || '') || 3
			const data = await getSearchQuesListService({
				userId: '62',
				keyword,
				isDeleted,
				isStar,
				offset,
				pageSize,
			})
			return data
		},
		{ refreshDeps: [searchParams] },
	)
	return { data, loading, error }
}

export default useLoadSearchQues
