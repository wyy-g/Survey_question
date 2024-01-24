import React, { FC, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest, useDebounceFn } from 'ahooks'
import { Spin, Empty } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

import ListSearch from '../../components/ListSearch'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import {
	getAllQuestionListService,
	getSearchQuesListService,
	getSortQuestionService,
} from '../../services/question'
import ListSort from '../../components/ListSort'

const List: FC = () => {
	useTitle('问卷调查 - 我的问卷')
	const [questionList, setQuestionList] = useState([])

	const [searchParams] = useSearchParams()
	const keyword = searchParams.get('keyword') || ''
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)
	const haveMoreData = total > questionList.length

	const [status, setStatus] = useState('allQues')
	const [timeType, setTimeType] = useState('initCreatedAt')

	// 获取问题内容元素为其添加滚动事件
	const containerRef = useRef<HTMLDivElement>(null)
	// 获取底部dom元素
	const footerRef = useRef<HTMLDivElement>(null)

	// keyword变化是重置信息
	useEffect(() => {
		setPage(1)
		setTotal(0)
		setQuestionList([])
		tryLoadMore()
	}, [keyword])

	// 加载函数
	const {
		run: load,
		loading,
		refresh,
	} = useRequest(
		async () => {
			const data = keyword
				? await getSearchQuesListService({
						userId: '62',
						keyword,
						isDeleted: false,
						isStar: false,
						page,
						pageSize: 5,
						isPublished: status,
					})
				: await getAllQuestionListService(62, page, 5, status)
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
					// 如果全部问卷下，是创建或者修改查询
					if (status === 'allQues' && timeType === 'initCreatedAt') {
						load()
					} else if (status === 'allQues' && timeType !== 'initCreatedAt') {
						// 不管全部问卷下还是已发布未发布，只要是初始状态查询
						loadSortData(status, timeType, page)
					} else if (status !== 'allQues' && timeType !== 'initCreatedAt') {
						// 不是全部问卷且不是初始状态
						loadSortData(status, timeType, page)
					} else if (status !== 'allQues' && timeType === 'initCreatedAt') {
						load()
					}
				}
			}
		},
		{ wait: 300 },
	)

	// 加载排序数据的函数
	const { run: loadSortData } = useRequest(
		async (status, timeType, page) => {
			const data = await getSortQuestionService({
				userId: '62',
				sort: timeType,
				page,
				pageSize: 5,
				isPublished: status,
				keyword,
			})
			return data
		},
		{
			manual: true,
			onSuccess(res) {
				const { quesData = [], total } = res
				setQuestionList(questionList.concat(quesData))
				setTotal(total)
				setPage(page + 1)
			},
		},
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

	useEffect(() => {
		// 如果全部问卷下，是创建或者修改查询
		if (status === 'allQues' && timeType === 'initCreatedAt') {
			load()
		} else if (status === 'allQues' && timeType !== 'initCreatedAt') {
			// 不管全部问卷下还是已发布未发布，只要是初始状态查询
			loadSortData(status, timeType, page)
		} else if (status !== 'allQues' && timeType !== 'initCreatedAt') {
			// 不是全部问卷且不是初始状态
			loadSortData(status, timeType, page)
		} else if (status !== 'allQues' && timeType === 'initCreatedAt') {
			load()
		}
	}, [status, timeType])

	// 根据是否发布与创建修改时间触发的函数
	function handleFilterChange(newStatus: string, newTimeType: string) {
		setStatus(newStatus)
		setTimeType(newTimeType)
		setQuestionList([])
		setPage(1)
	}

	// 处理假删除问卷，但是没有删除后立即触发页面更新
	function handleDelQuestion() {
		// refresh()
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
							<ListSort onFilterChange={handleFilterChange}></ListSort>
						</div>
						<div className={styles['search']}>
							<ListSearch />
						</div>
					</div>
				</div>
			</div>
			<div className={styles['list-content']} ref={containerRef}>
				{questionList.length > 0 &&
					questionList.map((ques: any) => {
						const { id } = ques
						return <QuestionCard key={id} {...ques} onDelQuestion={handleDelQuestion} />
					})}
				<div ref={footerRef} className={styles['list-footer']}>
					<div style={{ margin: '10px', textAlign: 'center' }}>{loadMoreContentElem()}</div>
				</div>
			</div>
		</>
	)
}

export default List
