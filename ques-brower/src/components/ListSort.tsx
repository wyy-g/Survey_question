import React, { FC, useState } from 'react'
import { Select, Space } from 'antd'
import { useSearchParams } from 'react-router-dom'

type ListSortProps = {
	onFilterChange: (type: string, timeType: string) => void
}

const ListSort: FC<ListSortProps> = ({ onFilterChange }) => {
	const [searchParams] = useSearchParams()
	const keyword = searchParams.get('keyword')
	const [status, setStatus] = useState('allQues')
	const [timeType, setTimeType] = useState('createAt')

	const handleStatusChange = (value: string) => {
		setStatus(value)
		onFilterChange(value, timeType)
	}

	const handleTimeTypeChange = (value: string) => {
		setTimeType(value)
		onFilterChange(status, value)
	}

	return (
		<>
			<Space>
				<Select
					defaultValue="allQues"
					style={{ width: 90, textAlign: 'center' }}
					onChange={handleStatusChange}
					options={[
						{ value: 'allQues', label: '全部' },
						{ value: 'true', label: '已发布' },
						{ value: 'false', label: '未发布' },
					]}
				/>
				<Select
					defaultValue="initCreatedAt"
					style={{ width: 100, textAlign: 'center' }}
					onChange={handleTimeTypeChange}
					options={[
						{ value: 'initCreatedAt', label: '最初创建', disabled: keyword ? true : false },
						{ value: 'createdAt', label: '最新创建' },
						{ value: 'updatedAt', label: '最近修改' },
					]}
				/>
			</Space>
		</>
	)
}

export default ListSort
