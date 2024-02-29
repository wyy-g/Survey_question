import React, { FC, useState } from 'react'
import { Button, Skeleton, Table, Space, Tooltip, Empty } from 'antd'
import IconFont from '../../../utools/IconFont'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import addZero from '../../../utools/addZero'
import useLoadAnswers from '../../../hooks/useLoadAnswers'
import PieChart from './pieChart'
import ColumnChart from './columnChart'
import BarChart from './barChart'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import styles from './index.module.scss'

const Statistics: FC = () => {
	const { loading } = useLoadQuestionData()
	const { componentList } = useGetComponentStore()
	const { data: answersData, run: reloadAnswers, loading: loadAnswersLoading } = useLoadAnswers()
	const { answersList = [], count = 0 } = answersData ? answersData : {}
	// 激活会有短暂边框显示
	const [activeAnswerId, setActiveAnswerId] = useState<number | string | null>()
	// 状态显示表格还是图形
	const [showState, setShowState] = useState('table')
	const [currentChartType, setCurrentChartType] = useState('barChart')
	// 存储子组件图表传过来的实例
	const [chartInstance, setChartInstance] = useState()

	// 点击题目跳到指定位置
	function scrollToAnchor(anchorName: string, id: number | string) {
		if (anchorName) {
			const anchorElement = document.getElementById(anchorName)
			if (anchorElement) {
				anchorElement.scrollIntoView()
				setActiveAnswerId(id)
				setTimeout(() => {
					setActiveAnswerId(null)
				}, 500)
			}
		}
	}

	return (
		<div className={styles['stat-detail-wrapper']}>
			<div className={styles['catalog']}>
				<div style={{ margin: '15px 20px' }}>题目</div>
				{componentList.length > 0 ? (
					componentList.map(c => {
						const { id, title, order_index, props } = c
						const { isShow = false } = props
						return (
							<>
								<div
									key={id}
									className={styles['title-wrapper']}
									onClick={() => scrollToAnchor(`answer-section-${id}`, id)}
								>
									<div className={styles['title']}>
										<span>
											{addZero(order_index!)}.&nbsp;{title}
										</span>
									</div>
								</div>
							</>
						)
					})
				) : (
					<Empty style={{ marginTop: '150px' }} description={'暂时没有数据哦'} />
				)}
			</div>
			<div className={styles['stat-detail']}>
				<div className={styles['stat-params']}>
					<div>params</div>
					<Button
						icon={
							<IconFont
								type="icon-shuaxin"
								className={loadAnswersLoading ? styles['rotate-icon'] : ''}
							/>
						}
						onClick={() => reloadAnswers()}
					></Button>
				</div>
				{componentList.map(c => {
					const { id, title, order_index, props, type } = c
					// 该类型的问题是否需要图标
					const chartComType = ['questionRadio', 'questionCheckbox']
					const isShowChart = chartComType.includes(type)
					const { isShow = false, isMustFill, list, options } = props

					// const chartRef = useRef()

					const columns = [
						{
							title: '答案',
							dataIndex: 'answer',
							key: 'answer',
							width: 200,
						},
					]
					if (isShowChart) {
						columns[0].title = '选项'
						columns.push({
							title: '计数',
							dataIndex: 'count',
							key: 'count',
							width: 200,
						})
					}

					const dataSource = answersList.flatMap((parentAnswer: any) => {
						return parentAnswer.answers.map((item: any) => {
							return item
						})
					})

					// 生成表格的data格式
					function genDataSource(type: string) {
						const filterData =
							dataSource.filter((answer: any) => answer.question_type == type) || []

						if (type === 'questionRadio') {
							return options?.map((opt: any) => {
								return {
									key: opt.id,
									answer: opt.text,
									count: filterData.filter((item: any) => item.answer_value === opt.text).length,
								}
							})
						}

						if (type === 'questionCheckbox') {
							return list?.map((opt: any) => {
								return {
									key: opt.id,
									answer: opt.text,
									count: filterData.filter((item: any) => item.answer_value.includes(opt.text))
										.length,
								}
							})
						}

						return filterData.map((answer: any) => {
							return {
								key: answer.answer_id,
								answer: answer.answer_value,
							}
						})
					}

					// 生成每个问题有几个答案
					function genAnswerByType(type: string) {
						return dataSource.filter((answer: any) => answer.question_type == type).length
					}

					function handleToggleTableChart() {
						if (showState === 'table') {
							setShowState('chart')
							setCurrentChartType('barChart') // 切换到图形时，默认显示统计图
						} else {
							setShowState('table')
						}
					}

					const chartTypeName = {
						barChart: '条形图',
						columnChart: '柱状图',
						pieChart: '饼图',
					}

					// 导出chart图表为图片
					function downloadChartImage() {
						/* eslint-disable */
						// @ts-ignore
						chartInstance?.current.downloadImage(`${title}_${chartTypeName[currentChartType]}`)
					}
					// 接收子组件图表传过来的实例
					function handleChartInstance(chartInstance: any) {
						setChartInstance(chartInstance)
					}

					return (
						<>
							<div key={id} className={styles['answer-detail']}>
								<div
									className={`${styles['answer-item']} ${
										activeAnswerId === c.id ? styles['active-answer-header'] : ''
									}`}
									id={`answer-section-${id}`}
								>
									<div className={styles['answer-item-header']}>
										<span>
											{isMustFill && <IconFont type="icon-bitian" color="red" />}
											{order_index}.&nbsp;{title}
										</span>
										{isShowChart ? (
											<Space>
												{/* 当显示为图形时，添加切换不同图表类型的按钮 */}
												{showState === 'chart' && (
													<Space>
														<Tooltip
															placement="top"
															title={<span style={{ color: '#fff' }}>保存为图片</span>}
															arrow={true}
															overlayClassName={styles['toolTipStyle']}
															color="#ff4d4f"
														>
															<Button
																style={{ background: '#f2f3f9', border: 'none' }}
																icon={<IconFont type="icon-xiazai" />}
																onClick={downloadChartImage}
															/>
														</Tooltip>

														<Button
															type={currentChartType == 'statChart' ? 'primary' : 'text'}
															style={{
																background:
																	currentChartType === 'statChart' ? '#1677ff' : '#f2f3f9',
															}}
															onClick={() => setCurrentChartType('statChart')}
															icon={<IconFont type="icon-tiaoxingtu-shu-2" />}
														>
															柱状图
														</Button>
														<Button
															type={currentChartType == 'barChart' ? 'primary' : 'text'}
															style={{
																background: currentChartType === 'barChart' ? '#1677ff' : '#f2f3f9',
															}}
															onClick={() => setCurrentChartType('barChart')}
															icon={<IconFont type="icon-tiaoxingtu-heng" />}
														>
															条形图
														</Button>
														<Button
															type={currentChartType == 'pieChart' ? 'primary' : 'text'}
															style={{
																background: currentChartType === 'pieChart' ? '#1677ff' : '#f2f3f9',
															}}
															icon={<IconFont type="icon-bingtu" />}
															onClick={() => setCurrentChartType('pieChart')}
														>
															饼图
														</Button>
													</Space>
												)}
												<Button
													type="text"
													style={{ background: '#f2f3f9' }}
													icon={<IconFont type="icon-65qiehuan" />}
													onClick={handleToggleTableChart}
												>
													{showState === 'table' ? '图形' : '表格'}
												</Button>
											</Space>
										) : (
											<span style={{ fontSize: '12px' }}>共 {genAnswerByType(type)} 条</span>
										)}
									</div>
									<div className={styles['answer-item-data']}>
										{loadAnswersLoading ? (
											<Skeleton />
										) : showState === 'table' ? (
											<>
												{/* {type === 'questionTiankong' && genComponent(c)} */}
												<Table columns={columns} dataSource={genDataSource(type)} />
											</>
										) : (
											<div style={{ width: '80%', marginTop: '5px' }}>
												{currentChartType === 'statChart' && (
													<ColumnChart
														chartData={genDataSource(type)}
														onChartReady={handleChartInstance}
													/>
												)}
												{currentChartType === 'barChart' && (
													<BarChart
														chartData={genDataSource(type)}
														onChartReady={handleChartInstance}
													/>
												)}
												{currentChartType === 'pieChart' && (
													<PieChart
														chartData={genDataSource(type)}
														onChartReady={handleChartInstance}
													/>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</>
					)
				})}
			</div>
		</div>
	)
}

export default Statistics