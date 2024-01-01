import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import { Empty, Table, Tag, Button, Space, Modal, Spin } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

import ListSearch from '../../components/ListSearch'
import ListPage from '../../components/ListPage'
import styles from './common.module.scss'
import { getTrashQuesService } from '../../services/question'
import useLoadSearchQues from '../../hooks/useLoadSearchQues'

// const rowQuestionList = [
// 	{ id: '1', title: '问卷1', isPublished: false, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '2', title: '问卷1', isPublished: true, isStar: true, answerCount: 5, createAt: '3.10' },
// 	{ id: '3', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// 	{ id: '4', title: '问卷1', isPublished: true, isStar: false, answerCount: 5, createAt: '3.10' },
// ]

const { confirm } = Modal

const Trash: FC = () => {
	useTitle('问卷调查 - 回收站')

	const [questionList, setQuestionList] = useState([])
	const [searchParams] = useSearchParams()
	const page = parseInt(searchParams.get('page') || '') || 1
	const pageSize = parseInt(searchParams.get('pageSize') || '') || 3

	const { data = {}, loading } = useRequest(
		async () => await getTrashQuesService('62', page, pageSize),
	)
	const { userDelQues = [], total } = data

	const { data: trashData = {}, loading: trashLoading } = useLoadSearchQues({
		isDeleted: true,
		isStar: false,
	})
	const { quesData = [] } = trashData

	useEffect(() => {
		if (searchParams.get('keyword')) {
			setQuestionList(quesData)
		} else {
			setQuestionList(userDelQues)
		}
	}, [data, loading, trashData, trashLoading])

	// 记录选中的id
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const tableColumns = [
		{
			title: '标题',
			dataIndex: 'title',
		},
		{
			title: '是否发布',
			dataIndex: 'isPublished',
			render: (isPublished: boolean) =>
				isPublished ? <Tag color="processing">已发布</Tag> : <Tag color="red">未发布</Tag>,
		},
		{
			title: '答卷数量',
			dataIndex: 'answerCount',
		},
		{
			title: '创建时间',
			dataIndex: 'createAt',
		},
	]

	function del() {
		confirm({
			title: '确认彻底删除该问卷？',
			icon: <ExclamationCircleFilled />,
			content: '删除以后不可找回',
			onOk: () => alert('123'),
		})
	}

	const TableElem = (
		<>
			<div style={{ marginBottom: '14px' }}>
				<Space>
					<Button type="primary" disabled={selectedIds.length === 0}>
						恢复
					</Button>
					<Button danger disabled={selectedIds.length === 0} onClick={del}>
						彻底删除
					</Button>
				</Space>
			</div>
			<Table
				dataSource={questionList}
				columns={tableColumns}
				pagination={false}
				rowKey={(q: any) => q.id}
				rowSelection={{
					type: 'checkbox',
					onChange: selectedRowKeys => {
						setSelectedIds(selectedRowKeys as string[])
					},
				}}
			/>
		</>
	)

	return (
		<>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<h3>回收站</h3>
				</div>
				<div className={styles['right']}>
					<div className={styles['search']}>
						<ListSearch />
					</div>
				</div>
			</div>
			<div className={styles['content']}>
				{loading && (
					<div style={{ margin: '50px', textAlign: 'center' }}>
						<Spin></Spin>
					</div>
				)}
				{!loading && questionList.length > 0 && TableElem}
				{!loading && questionList.length === 0 && <Empty description="暂无数据" />}
			</div>
			<div className={styles['footer']}>
				<ListPage total={total} pageSize={pageSize}></ListPage>
			</div>
		</>
	)
}

export default Trash
