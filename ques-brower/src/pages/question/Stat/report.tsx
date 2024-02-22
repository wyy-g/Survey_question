import React, { FC, useState, useEffect } from 'react'
import { Button, Space, Checkbox, Popover, Table } from 'antd'
import styles from './report.module.scss'
import IconFont from '../../../utools/IconFont'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import useLoadAnswers from '../../../hooks/useLoadAnswers'

const Report: FC = () => {
	const { componentList } = useGetComponentStore()
	// 下拉框的显示
	const titleList = componentList.map(item => item.title)
	// 选中的列表
	const [checkedList, setCheckedList] = useState(titleList)
	// 下拉框动态改变列中的所有
	const columns = ['开始时间', '提交时间', '填写设备', '浏览器', 'IP', ...titleList]
	const { data: answersData } = useLoadAnswers()

	const [dataSource, setDataSource] = useState([])
	console.warn(answersData, componentList)
	const operationColumn = {
		title: '操作',
		key: 'operation',
		render: (_: any, record: any) => (
			<Space size="middle">
				<Button type="text">查看详情 {record}</Button>
				<Button type="text" danger>
					删除
				</Button>
			</Space>
		), // 这里根据实际需求定义操作内容
		// fixed: 'right',
		width: 150,
	}
	// 不包含操作列的columns数组
	const basicColumns = columns.filter(title => title !== '操作')
	// table的表头也就是table的列名
	const tableColumns = basicColumns.map((title, index) => ({
		title,
		dataIndex: title,
		key: index,
	}))
	// 根据checked动态控制列的显示与隐藏
	const [filteredTableColumns, setFilteredTableColumns] = useState([...tableColumns])

	useEffect(() => {
		const filteredColumns = tableColumns.filter(column => checkedList.includes(column.title))
		setFilteredTableColumns([...filteredColumns])
	}, [checkedList])

	useEffect(() => {
		if (answersData && answersData.length > 0) {
			// 根据answersData的结构调整此处转换逻辑，将其转化为表格所需的dataSource格式
			const transformedDataSource = answersData.map((answer: any, index: number) => {
				const singleCom = componentList.find(c => c.id === answer.component_instance_id)
				console.log('singleCom', singleCom)
				return {
					key: index,
					开始时间: answer.start_time || '', // 确保startTime不为null或undefined，给一个默认值''
					提交时间: answer.submit_time || '',
					填写设备: answer.deviceInfo || '', // 如果deviceInfo是对象且可能不存在，使用可选链操作符(?.)
					浏览器: answer.browserInfo || '',
					IP: answer.ipAddress || '',
					[singleCom!.title]: answer.answer_value,
				}
			})
			setDataSource(transformedDataSource)
		}
	}, [answersData])

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
			</div>
			<div className={styles['report-main']}>
				<div className={styles['report-info']}>
					<span>共收集{answersData && answersData.length}份</span>
					<Button danger>批量删除</Button>
				</div>
				<Table columns={filteredTableColumns} dataSource={dataSource}></Table>
			</div>
		</div>
	)
}

export default Report
