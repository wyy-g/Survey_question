import React, { FC, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest, useDebounceFn } from 'ahooks'
import { Select, Space, Spin, Empty } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

import ListSearch from '../../components/ListSearch'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import { getAllQuestionListService } from '../../services/question'
import { getSearchQuesListService } from '../../services/question'
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
	const keyword = searchParams.get('keyword') || ''
	// const page = parseInt(searchParams.get('page') || '') || 1
	// const pageSize = parseInt(searchParams.get('pageSize') || '') || 4

	// const { data = {}, loading } = useRequest(
	// 	async () => await getAllQuestionListService(62, page, pageSize),
	// )
	// const { data: searchData = {}, loading: searchLoading } = useLoadSearchQues({
	// 	isDeleted: false,
	// 	isStar: false,
	// })
	// const { userAllQues = [], total = 0 } = data
	// // 搜索或分页后的数据
	// const { quesData = [] } = searchData

	// useEffect(() => {
	// 	if (searchParams.get('keyword')) {
	// 		setQuestionList(quesData)
	// 	} else {
	// 		setQuestionList(userAllQues)
	// 	}
	// }, [data, loading, searchData, searchLoading])

	// const [started, setStarted] = useState(false)
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)
	const haveMoreData = total > questionList.length

	// 获取问题内容元素为其添加滚动事件
	const containerRef = useRef<HTMLDivElement>(null)
	// 获取底部dom元素
	const footerRef = useRef<HTMLDivElement>(null)

	// keyword变化是重置信息
	useEffect(() => {
		setPage(1)
		setTotal(0)
		setQuestionList([])
		console.log(123)
	}, [keyword])
	// 加载函数
	const { run: load, loading } = useRequest(
		async () => {
			const data = keyword
				? await getSearchQuesListService({
						userId: '62',
						keyword,
						isDeleted: false,
						isStar: false,
						page,
						pageSize: 5,
					})
				: await getAllQuestionListService(62, page, 5)
			return data
		},
		{
			manual: true,
			onSuccess(res) {
				if (keyword) {
					const { quesData = [], total = 0 } = res
					setQuestionList(questionList.concat(quesData))
					setTotal(total)
					setPage(page + 1)
				} else {
					const { userAllQues = [], total = 0 } = res
					setQuestionList(questionList.concat(userAllQues))
					setTotal(total)
					setPage(page + 1)
				}
			},
			refreshDeps: [keyword],
		},
	)

	// 触发加载函数(使用了ahooks里面的防抖函数)
	const { run: tryLoadMore } = useDebounceFn(
		() => {
			if (containerRef.current) {
				// const containerRect = containerRef.current.getBoundingClientRect()
				const scrollHeight = containerRef.current.scrollHeight
				const scrollTop = containerRef.current.scrollTop
				const clientHeight = containerRef.current.clientHeight

				// 判断是否滚动到底部
				if (scrollHeight - scrollTop <= clientHeight) {
					load() //真正加载数据
				}
			}
		},
		{ wait: 300 },
	)
	// 当页面加载
	useEffect(() => {
		tryLoadMore()
	}, [keyword])

	// 当页面滚动时加载
	useEffect(() => {
		if (haveMoreData) {
			if (containerRef.current) {
				containerRef.current!.addEventListener('scroll', tryLoadMore)
			}
		}
		return () => {
			if (containerRef.current) {
				containerRef.current!.removeEventListener('scroll', tryLoadMore)
			}
		}
	}, [keyword, haveMoreData])

	useEffect(() => {
		if (!haveMoreData) {
			setPage(1)
		}
	}, [haveMoreData])

	function handleTimeChange() {
		console.log('123')
	}

	const loadMoreContentElem = () => {
		if (loading) return <Spin></Spin>

		if (total === 0) return <Empty description="暂无数据" />
		if (!haveMoreData)
			return (
				<span>
					没有更多了
					<SmileOutlined style={{ marginLeft: '8px' }} />
				</span>
			)
		return <span>开始加载下一页</span>
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
			<div className={styles['list-content']} ref={containerRef}>
				{/* {loading && (
					<div style={{ margin: '50px', textAlign: 'center' }}>
						<Spin></Spin>
					</div>
				)} */}
				{questionList.length > 0 &&
					questionList.map((ques: any) => {
						const { id } = ques
						return <QuestionCard key={id} {...ques} />
					})}
				{/* {!loading && questionList.length === 0 && <Empty description="暂无数据" />} */}
				<div ref={footerRef} className={styles['list-footer']}>
					<div style={{ margin: '10px', textAlign: 'center' }}>{loadMoreContentElem()}</div>
				</div>
			</div>
		</>
	)
}

export default List
