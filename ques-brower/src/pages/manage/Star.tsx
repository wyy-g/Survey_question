import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import type { MenuProps } from 'antd'
import { Dropdown, Button, Space, Empty, Spin, Pagination } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import ListSearch from '../../components/ListSearch'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import { getStarQuesService } from '../../services/question'
import useLoadSearchQues from '../../hooks/useLoadSearchQues'

// const rowQuestionList = [
// 	{ id: '1', title: '问卷1', isPublished: false, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '2', title: '问卷1', isPublished: true, isStar: true, answerCount: 5, createAt: '3.10' },
// 	{ id: '3', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '4', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// ]

const Star: FC = () => {
	useTitle('问卷调查 - 星标问卷')
	const [questionList, setQuestionList] = useState([])

	const [searchParams] = useSearchParams()
	const offset = parseInt(searchParams.get('page') || '') || 1
	const pageSize = parseInt(searchParams.get('pageSize') || '') || 3

	const { data = {}, loading } = useRequest(
		async () => await getStarQuesService('62', offset, pageSize),
	)
	const { userStarQues = [], total } = data

	const { data: searchData = {}, loading: searchLoading } = useLoadSearchQues({
		isDeleted: false,
		isStar: true,
	})

	const { quesData = [] } = searchData

	useEffect(() => {
		setQuestionList(userStarQues)
	}, [data, loading])

	useEffect(() => {
		setQuestionList(quesData)
	}, [searchData, searchLoading])

	const items: MenuProps['items'] = [
		{
			key: '1',
			label: '最新创建',
		},
		{
			key: '2',
			label: '最近修改',
			onClick: () => {
				console.log('最近修改')
			},
		},
	]
	return (
		<>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<h3>星标问卷</h3>
				</div>
				<div className={styles['right']}>
					<div className={styles['filter']}>
						<div className={styles['time']}>
							<Dropdown menu={{ items }} placement="bottom">
								<Button>
									<Space>
										时间排序
										<DownOutlined />
									</Space>
								</Button>
							</Dropdown>
						</div>
						<div className={styles['search']}>
							<ListSearch />
						</div>
					</div>
				</div>
			</div>
			<div className={styles['content']}>
				{loading && (
					<div style={{ margin: '50px', textAlign: 'center' }}>
						<Spin></Spin>
					</div>
				)}
				{!loading && questionList.length === 0 && <Empty description="暂无数据" />}
				{!loading &&
					questionList.length > 0 &&
					questionList.map((ques: any) => {
						const { id } = ques
						return <QuestionCard key={id} {...ques} />
					})}
			</div>
			<div className={styles['footer']}>
				<Pagination total={total} />
			</div>
		</>
	)
}

export default Star
