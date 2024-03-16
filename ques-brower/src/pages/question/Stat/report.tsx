import React, { FC, useState, useEffect } from 'react'
import { Button, Space, Checkbox, Popover, Table, Popconfirm, message, Drawer, Divider } from 'antd'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
/* eslint-enable */
import styles from './report.module.scss'
import IconFont from '../../../utools/IconFont'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import useLoadAnswers from '../../../hooks/useLoadAnswers'
import { deleteAnswers } from '../../../services/answer'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { getToekn } from '../../../utools/user-storage'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'

const Report: FC = () => {
	const { loading } = useLoadQuestionData()
	const { id = '' } = useParams()
	const { title } = useGetPageInfo()
	const { componentList } = useGetComponentStore()
	// 下拉框的显示
	const titleList = componentList.map(item => item.title)
	// 选中的列表
	const [checkedList, setCheckedList] = useState(titleList)
	// 下拉框动态改变列中的所有
	const columns = ['开始时间', '提交时间', '填写设备', '浏览器', 'IP地址', ...titleList]
	// 记录选中的id
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	// 控制抽屉显示(查看详情)
	const [showDrawer, setShowDrawer] = useState(false)

	const { data: answersData, run: reloadAnswers, loading: loadAnswersLoading } = useLoadAnswers()
	const { answersList = [], count = 0 } = answersData ? answersData : {}

	const [dataSource, setDataSource] = useState([])
	// 不包含操作列的columns数组
	const basicColumns = columns.filter(title => title !== '操作')
	const serialNumberColumn = {
		title: '序号',
		key: basicColumns.length + 1,
		dataIndex: '序号',
		align: 'center',
		render: (text: any, record: any, index: any) => `${index + 1}`,
		fixed: 'left', // 固定在右侧
		width: 80,
	}
	// 操作列定义
	const operationColumn = {
		title: '操作',
		key: basicColumns.length,
		dataIndex: '操作',
		align: 'center',
		render: (text: any, record: any) => (
			<Space size="small">
				<Button size="small" type="link" onClick={() => handleViewDetails(record)}>
					查看详情
				</Button>
				<Popconfirm
					title="确定要删除吗？"
					okText="确定"
					cancelText="取消"
					onConfirm={() => handleDelete(record.key)}
				>
					<Button size="small" type="link" danger>
						删除
					</Button>
				</Popconfirm>
			</Space>
		),
		fixed: 'right', // 固定在右侧
		width: 150,
	}
	// table的表头也就是table的列名
	const tableColumns = [
		serialNumberColumn,
		...basicColumns.map((title, index) => ({
			title,
			dataIndex: title,
			key: index,
			width: 100,
			// align: 'center',
		})),
		operationColumn,
	]
	// 根据checked动态控制列的显示与隐藏
	const [filteredTableColumns, setFilteredTableColumns] = useState([...tableColumns])

	useEffect(() => {
		const filteredColumns = tableColumns.filter(column => checkedList.includes(column.title))
		setFilteredTableColumns([serialNumberColumn, ...filteredColumns, operationColumn])
	}, [checkedList, componentList])

	// 存储点击详情的时候的具体某条答案的信息
	const [answerDetail, setAnswerDetail] = useState<{ [key: string]: string }>()

	// 点击查看详情
	const handleViewDetails = (record: any) => {
		// 在这里添加查看详细信息的功能实现
		setAnswerDetail(record)
		setShowDrawer(true)
	}

	// 详情里面的列
	const detailColumns = [
		{
			title: '题目',
			dataIndex: 'question',
		},
		{
			title: '答案',
			dataIndex: 'answer',
		},
	]
	// 生成详情中的行
	function genDetailRow(answerDetail: any) {
		const rowArr = []
		for (const item in answerDetail) {
			if (
				item !== '开始时间' &&
				item !== '提交时间' &&
				item !== '填写时长' &&
				item !== '填写设备' &&
				item !== '浏览器' &&
				item !== 'IP' &&
				item !== 'key'
			) {
				rowArr.push({
					key: item + 1,
					question: item,
					answer: answerDetail[item],
				})
			}
		}
		return rowArr
	}

	const { run: deleteAnswersByIds } = useRequest(
		async (ids: string[] | number[]) => await deleteAnswers(ids),
		{
			manual: true,
			onSuccess: () => {
				message.success('删除成功')
				reloadAnswers()
			},
			onError: () => {
				message.error('删除失败，请稍后再试')
			},
		},
	)

	// 删除单个答案
	const handleDelete = (id: number) => {
		deleteAnswersByIds([id])
	}
	// 删除多个答案
	const hendleBatchDelete = () => {
		deleteAnswersByIds(selectedIds)
	}

	function tianxieTime(answerDetail: any) {
		const end_time = moment(answerDetail['提交时间'])
		const start_time = moment(answerDetail['开始时间'])
		// 计算时间差（以毫秒为单位）
		const diffInMilliseconds = end_time.diff(start_time)
		// 转换为秒
		const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
		const minutes = Math.floor(diffInSeconds / 60)
		const seconds = diffInSeconds % 60
		if (minutes) {
			return `${minutes}分钟${seconds}秒`
		} else {
			return `${seconds}秒`
		}
	}

	async function downloadTableExcel(id: string) {
		try {
			const response = await fetch(`/api/download/${id}`, {
				headers: {
					Authorization: `Bearer ${getToekn()}`,
				},
			})
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `${title}.xlsx`
			a.click()
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading Excel file:', error)
		}
	}

	useEffect(() => {
		if (answersList && answersList.length > 0) {
			// 根据answersData的结构调整此处转换逻辑，将其转化为表格所需的dataSource格式
			const transformedDataSource = answersList.map((answer: any) => {
				// const singleCom = componentList.find(c => c.id === answer.component_instance_id)
				return componentList.reduce(
					(acc, c) => {
						// 获取当前组件对应的答案
						const answerContent = answer.answers.find((a: any) => a.component_instance_id === c.id)
						// 将组件标题及其答案添加到累积器对象中
						if (answerContent !== undefined) {
							// 防止未找到答案时添加空属性
							/* eslint-disable */
							// @ts-ignore
							acc[c.title] = answerContent.answer_value
						}
						return acc
					},
					{
						key: answer.submission_id,
						开始时间: moment.utc(answer.start_time).local().format('YYYY-MM-DD HH:mm:ss') || '', // 确保startTime不为null或undefined，给一个默认值''
						提交时间: moment.utc(answer.submit_time).local().format('YYYY-MM-DD HH:mm:ss') || '',
						填写设备: answer.device_info || '', // 如果deviceInfo是对象且可能不存在，使用可选链操作符(?.)
						浏览器: answer.browser_info || '',
						IP: answer.ip_address || '',
					},
				)
			})

			setDataSource(transformedDataSource)
		} else {
			setDataSource([])
		}
	}, [answersList])

	const moreColumnElem = () => {
		// 是否全选
		const checkAll = columns.length === checkedList.length
		const indeterminate = checkedList.length > 0 && checkedList.length < columns.length

		// 点击全选/全不选
		const onCheckAllChange = (e: any) => {
			setCheckedList(e.target.checked ? columns : [])
		}
		const onCheckedChange = (list: any) => {
			setCheckedList(list)
		}

		return (
			<div>
				<Checkbox indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>
					全选/全不选
				</Checkbox>
				<Checkbox.Group
					options={columns}
					value={checkedList}
					onChange={onCheckedChange}
					style={{ display: 'flex', flexDirection: 'column' }}
				></Checkbox.Group>
			</div>
		)
	}

	return (
		<div className={styles['report']}>
			<div className={styles['report-query']}>
				<Space>
					<Popover content={moreColumnElem} placement="bottom" arrow={false}>
						<Button icon={<IconFont type="icon-liebiao" />} style={{ backgroundColor: '' }}>
							更多列
						</Button>
					</Popover>
				</Space>
				<Space>
					<Button
						icon={
							<IconFont
								type="icon-shuaxin"
								className={loadAnswersLoading ? styles['rotate-icon'] : ''}
							/>
						}
						onClick={() => reloadAnswers()}
					></Button>
					<Button
						icon={<IconFont type="icon-xiazai" />}
						onClick={() => downloadTableExcel(id)}
					></Button>
				</Space>
			</div>
			<div className={styles['report-main']}>
				<div className={styles['report-info']}>
					<span>共收集&nbsp;{count}&nbsp;份</span>
					<Button danger onClick={hendleBatchDelete} disabled={selectedIds.length <= 0}>
						批量删除
					</Button>
				</div>
				<Table
					columns={filteredTableColumns}
					dataSource={dataSource}
					// scroll={{ x: true }}
					rowSelection={{
						type: 'checkbox',
						onChange: selectedRowKeys => {
							setSelectedIds(selectedRowKeys as string[])
						},
					}}
					loading={loadAnswersLoading}
					pagination={{ pageSize: 5 }}
				></Table>
			</div>
			<Drawer title="数据详情" width={'60%'} onClose={() => setShowDrawer(false)} open={showDrawer}>
				{answerDetail && (
					<div className={styles['answer-detail']}>
						<div className={styles['answer-info']}>
							<p>开始时间: {answerDetail['开始时间']}</p>
							<p>提交时间: {answerDetail['提交时间']}</p>
							<p>填写时长: {tianxieTime(answerDetail)}</p>
							<p>填写设备: {answerDetail['填写设备']}</p>
							<p>浏览器: {answerDetail['浏览器']}</p>
							<p>IP地址: {answerDetail['IP']}</p>
						</div>
						<Divider></Divider>
						<div className="detail">
							<p>答案</p>
							<Table columns={detailColumns} dataSource={genDetailRow(answerDetail)}></Table>
						</div>
					</div>
				)}
			</Drawer>
		</div>
	)
}

export default Report
