import React, { FC, useState, ChangeEvent, useEffect } from 'react'
import { Input } from 'antd'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const { Search } = Input

const ListSearch: FC = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()
	const [searchParams] = useSearchParams()
	const keyword = searchParams.get('keyword')
	const [value, setValue] = useState('')
	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.target.value)
	}
	useEffect(() => {
		if (keyword) {
			setValue(keyword)
		}
	}, [])
	function handleSearch(value: string) {
		nav({
			pathname,
			search: `keyword=${value}`,
		})
	}
	return (
		<>
			<Search
				placeholder="请输入关键字"
				value={value}
				onChange={handleChange}
				onSearch={handleSearch}
				style={{ marginLeft: '20px', width: '190px' }}
				allowClear
			/>
		</>
	)
}

export default ListSearch
