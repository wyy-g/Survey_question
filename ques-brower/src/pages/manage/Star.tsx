import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import { Empty, Spin } from 'antd'

import ListSearch from '../../components/ListSearch'
import ListPage from '../../components/ListPage'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import { getStarQuesService } from '../../services/question'
import useLoadSearchQues from '../../hooks/useLoadSearchQues'

const Star: FC = () => {
	useTitle('问卷调查 - 星标问卷')
	const [questionList, setQuestionList] = useState([])

	const [searchParams] = useSearchParams()
	const keyword = searchParams.get('keyword')
	const page = parseInt(searchParams.get('page') || '') || 1
	const pageSize = parseInt(searchParams.get('pageSize') || '') || 4

	const { data = {}, loading } = useRequest(
		async () => await getStarQuesService('62', page, pageSize),
		{ refreshDeps: [searchParams] },
	)
	const { userStarQues = [], total } = data

	const { data: searchData = {}, loading: searchLoading } = useLoadSearchQues({
		isDeleted: false,
		isStar: true,
	})

	const { quesData = [], total: searchTotal } = searchData

	// 处理单个问卷标星状态改变的函数(取消标星后没有立即刷新展示新的数据)
	function handleUpdateSingleQuesStatus(quesId: number, newStatrState: boolean) {
		if (!newStatrState) {
			setQuestionList((prevQuestions: any) => {
				return prevQuestions.filter((ques: any) => ques.id !== quesId)
			})
		}
	}

	useEffect(() => {
		if (keyword) {
			setQuestionList(quesData)
		} else {
			setQuestionList(userStarQues)
		}
	}, [loading, searchLoading])

	return (
		<>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<h3>星标问卷</h3>
				</div>
				<div className={styles['right']}>
					<div className={styles['filter']}>
						<div className={styles['time']}>sort</div>
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
						return (
							<QuestionCard
								key={id}
								{...ques}
								onStarStatusChange={(newIsStar: boolean) => {
									handleUpdateSingleQuesStatus(id, newIsStar)
								}}
							/>
						)
					})}
			</div>
			<div className={styles['footer']}>
				<ListPage total={keyword ? searchTotal : total} pageSize={pageSize}></ListPage>
			</div>
		</>
	)
}

export default Star
