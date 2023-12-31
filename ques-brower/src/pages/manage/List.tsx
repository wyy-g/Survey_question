import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import { Select, Space, Spin, Empty } from 'antd'

import ListSearch from '../../components/ListSearch'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import { getAllQuestionListService } from '../../services/question'
import useLoadSearchQues from '../../hooks/useLoadSearchQues'

// const rowQuestionList = [
// 	{ id: '1', title: '问卷1', isPublished: false, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '2', title: '问卷1', isPublished: true, isStar: true, answerCount: 5, createAt: '3.10' },
// 	{ id: '3', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '4', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// ]

const List: FC = () => {
	useTitle('问卷调查 - 我的问卷')
	const [questionList, setQuestionList] = useState([])

	const [searchParams] = useSearchParams()
	const offset = parseInt(searchParams.get('page') || '') || 1
	const pageSize = parseInt(searchParams.get('pageSize') || '') || 3

	const { data = {}, loading } = useRequest(
		async () => await getAllQuestionListService(62, offset, pageSize),
	)
	const { data: searchData = {}, loading: searchLoading } = useLoadSearchQues({
		isDeleted: false,
		isStar: false,
	})
	const { userAllQues = [], total = 0 } = data
	// 搜索或分页后的数据
	const { quesData = [] } = searchData

	useEffect(() => {
		setQuestionList(userAllQues)
	}, [data, loading])

	useEffect(() => {
		setQuestionList(quesData)
	}, [searchData, searchLoading])

	function handleTimeChange() {
		console.log('123')
	}

	return (
		<>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<h3>我的问卷</h3>
				</div>
				<div className={styles['right']}>
					<div className={styles['filter']}>
						<div className={styles['time']}>
							<Space>
								<Select
									defaultValue="publishTrue"
									style={{ width: 90, textAlign: 'center' }}
									onChange={handleTimeChange}
									options={[
										{ value: 'publishTrue', label: '已发布' },
										{ value: 'publishFalse', label: '未发布' },
									]}
								/>
								<Select
									defaultValue="update"
									style={{ width: 103 }}
									onChange={handleTimeChange}
									options={[
										{ value: 'create', label: '最新创建' },
										{ value: 'update', label: '最近修改' },
									]}
								/>
							</Space>
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
				{!loading &&
					questionList.length > 0 &&
					questionList.map((ques: any) => {
						const { id } = ques
						return <QuestionCard key={id} {...ques} />
					})}
				{!loading && questionList.length === 0 && <Empty description="暂无数据" />}
			</div>
			<div className={styles['footer']}>loadmore 上拉加载更多</div>
		</>
	)
}

export default List
