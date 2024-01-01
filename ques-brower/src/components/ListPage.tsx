import React, { FC, useEffect, useState } from 'react'
import { Pagination } from 'antd'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

type PropsType = {
	total: number
	pageSize?: number
}

const ListPage: FC<PropsType> = props => {
	const { total, pageSize = 3 } = props
	const nav = useNavigate()
	const { pathname } = useLocation()

	const [searchParams] = useSearchParams()

	const [current, setCurrent] = useState(1)
	const [curPageSize, setCurPageSize] = useState(pageSize)

	useEffect(() => {
		const page = parseInt(searchParams.get('page') || '') || 1
		setCurrent(page)
		const curPageSize = parseInt(searchParams.get('pageSize') || '') || pageSize
		setCurPageSize(curPageSize)
	}, [searchParams])

	function handlePageChange(page: number, pageSize: number) {
		searchParams.set('page', page.toString())
		searchParams.set('pageSize', pageSize.toString())
		nav({
			pathname,
			search: searchParams.toString(),
		})
	}

	return (
		<Pagination
			current={current}
			total={total}
			pageSize={curPageSize}
			onChange={handlePageChange}
		></Pagination>
	)
}

export default ListPage
