import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle, useRequest } from 'ahooks'
import { Empty, Table, Tag, Button, Space, Modal, Spin, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

import ListSearch from '../../components/ListSearch'
import ListPage from '../../components/ListPage'
import styles from './common.module.scss'
import { getTrashQuesService } from '../../services/question'
import useLoadSearchQues from '../../hooks/useLoadSearchQues'
import { updateQuesService, deleteQuesService } from '../../services/question'

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
	const keyword = searchParams.get('keyword')
	const page = parseInt(searchParams.get('page') || '') || 1
	const pageSize = parseInt(searchParams.get('pageSize') || '') || 5

	const {
		data = {},
		loading,
		refresh,
	} = useRequest(async () => await getTrashQuesService('62', page, pageSize), {
		refreshDeps: [searchParams],
	})
	const { userDelQues = [], total } = data

	const { data: trashData = {}, loading: trashLoading } = useLoadSearchQues({
		isDeleted: true,
		isStar: false,
	})
	const { quesData = [], total: tarshTotal } = trashData

	useEffect(() => {
		if (keyword) {
			setQuestionList(quesData)
		} else {
			setQuestionList(userDelQues)
		}
	}, [loading, trashLoading])

	// 记录选中的id
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	// 恢复
	const { run: recoverQues } = useRequest(
		async () => {
			// 遍历数组有序执行异步函数
			for await (const id of selectedIds) {
				await updateQuesService(parseInt(id), { isDeleted: false })
			}
		},
		{
			manual: true,
			onSuccess() {
				// 手动刷新列表
				refresh()
				setSelectedIds([])
				message.success('恢复成功')
			},
		},
	)

	// 彻底删除
	const { run: deleteQues } = useRequest(async () => await deleteQuesService(selectedIds), {
		manual: true,
		onSuccess() {
			// 手动刷新列表
			refresh()
			setSelectedIds([])
			message.success('删除成功')
		},
	})

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
			title: '确认彻底删除问卷？',
			icon: <ExclamationCircleFilled />,
			content: '删除以后不可找回',
			cancelText: '取消',
			okText: '确认',
			onOk: deleteQues,
		})
	}

	const TableElem = (
		<>
			<div style={{ marginBottom: '14px' }}>
				<Space>
					<Button type="primary" disabled={selectedIds.length === 0} onClick={recoverQues}>
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
				<ListPage total={keyword ? tarshTotal : total} pageSize={pageSize}></ListPage>
			</div>
		</>
	)
}

export default Trash
