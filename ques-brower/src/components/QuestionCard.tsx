import React, { FC, useState } from 'react'
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from 'antd'
import {
	EditTwoTone,
	LineChartOutlined,
	StarOutlined,
	CopyOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useRequest } from 'ahooks'

import styles from './QuestionCard.module.scss'
import formatDate from '../utools/formatDate'
import { updateQuesService, copyQuesService } from '../services/question'

type PropsType = {
	id: number | string
	title: string
	isStar: boolean
	isPublished: boolean
	answerCount: number
	createdAt: string
	onStarStatusChange?(isStarState: boolean): void
	onDelQuestion?(): void
}

const { confirm } = Modal

const QuestionCard: FC<PropsType> = props => {
	const nav = useNavigate()
	const {
		id,
		title,
		createdAt,
		answerCount,
		isPublished,
		isStar,
		onStarStatusChange,
		onDelQuestion,
	} = props

	// 修改标星
	const [isStarState, setIsStarState] = useState(isStar)
	const { loading: changeStarLoading, run: changeStar } = useRequest(
		async () => {
			await updateQuesService(id as number, { isStar: !isStarState })
		},
		{
			manual: true,
			onSuccess() {
				setIsStarState(!isStarState) //更新Startate
				if (onStarStatusChange) {
					onStarStatusChange(!isStarState)
				}
				message.success('标星状态已更新')
			},
		},
	)

	// 复制
	const { run: duplicate, loading: copyLoading } = useRequest(
		async () => {
			let copyNum = 1
			let copyTitle = ''
			if (title.includes('_copy')) {
				copyTitle = `${title}${++copyNum}`
			} else {
				copyTitle = `${title}_copy`
			}
			const data = await copyQuesService(id as number, copyTitle)
			return data
		},
		{
			manual: true,
			onSuccess(res) {
				message.success('复制成功')
				nav(`/question/edit/${res.id}`)
			},
		},
	)

	// 假删除
	const [isDeletedState, setIsDeletedState] = useState(false)
	const { loading: deletedLoading, run: deletedQues } = useRequest(
		async () => {
			await updateQuesService(id as number, { isDeleted: true })
		},
		{
			manual: true,
			onSuccess() {
				if (onDelQuestion) {
					onDelQuestion()
				}
				setIsDeletedState(true)
				message.success('问卷已移到回收站')
			},
		},
	)

	function delQues() {
		confirm({
			title: '确定要删除此问卷吗? ',
			icon: <ExclamationCircleFilled />,
			onOk: deletedQues,
			okText: '确定',
			cancelText: '取消',
		})
	}

	// if (isDeletedState) return null

	return (
		<div className={styles['container']}>
			<div className={styles['title']}>
				<div className={styles['title__left']}>
					<Link to={isPublished ? `/question/stat/${id}` : `/question/edit/${id}`}>
						<Space>
							{isStarState == true && <StarOutlined style={{ color: 'red' }} />}
							{title}
						</Space>
					</Link>
				</div>
				<div className={styles['title__fight']}>
					<Space>
						{isPublished ? <Tag color="processing">已发布</Tag> : <Tag color="red">未发布</Tag>}
						<span style={{ marginRight: '10px' }}>答卷:{answerCount}</span>
						<span>{formatDate(createdAt)}</span>
					</Space>
				</div>
			</div>
			<Divider style={{ marginTop: '12px', marginBottom: '12px' }} />
			<div className={styles['opeartion']}>
				<div className={styles['opeartion-left']}>
					<Space>
						<Button
							icon={<EditTwoTone />}
							type="text"
							size="small"
							onClick={() => nav(`/question/edit/${id}`)}
						>
							编辑问卷
						</Button>
						<Button
							icon={<LineChartOutlined />}
							type="text"
							size="small"
							onClick={() => nav(`/question/stat/${id}`)}
							disabled={!isPublished}
						>
							数据统计
						</Button>
					</Space>
				</div>
				<div className={styles['opeartion-right']}>
					<Space>
						<Button
							type="text"
							icon={<StarOutlined />}
							size="small"
							onClick={changeStar}
							disabled={changeStarLoading}
						>
							{isStarState ? '取消标星' : '标星'}
						</Button>
						<Popconfirm
							title="确定要复制吗？"
							okText="确定"
							cancelText="取消"
							onConfirm={duplicate}
						>
							<Button type="text" icon={<CopyOutlined />} size="small" disabled={copyLoading}>
								复制
							</Button>
						</Popconfirm>

						<Button
							type="text"
							icon={<DeleteOutlined />}
							size="small"
							onClick={delQues}
							disabled={deletedLoading}
						>
							删除
						</Button>
					</Space>
				</div>
			</div>
		</div>
	)
}

export default QuestionCard
