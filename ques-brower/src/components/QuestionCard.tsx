import React, { FC } from 'react'
import { Button, Space, Divider, Tag, Popconfirm, Modal } from 'antd'
import {
	EditTwoTone,
	LineChartOutlined,
	StarOutlined,
	CopyOutlined,
	DeleteOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'

import styles from './QuestionCard.module.scss'
import formatDate from '../utools/formatDate'

type PropsType = {
	id: number | string
	title: string
	isStar: boolean
	isPublished: boolean
	answerCount: number
	createdAt: string
}

const { confirm } = Modal

const QuestionCard: FC<PropsType> = props => {
	const nav = useNavigate()
	const { id, title, createdAt, answerCount, isPublished, isStar } = props

	function duplicate() {
		alert('111')
	}

	function delQues() {
		confirm({
			title: '确定要删除此问卷吗? ',
			icon: <ExclamationCircleFilled />,
			onOk: () => alert('111'),
			okText: '确定',
			cancelText: '取消',
		})
	}

	return (
		<div className={styles['container']}>
			<div className={styles['title']}>
				<div className={styles['title__left']}>
					<Link to={isPublished ? `/question/stat/${id}` : `/question/edit/${id}`}>
						<Space>
							{isStar == true && <StarOutlined style={{ color: 'red' }} />}
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
						<Button type="text" icon={<StarOutlined />} size="small">
							{isStar ? '取消标星' : '标星'}
						</Button>
						<Popconfirm
							title="确定要复制吗？"
							okText="确定"
							cancelText="取消"
							onConfirm={duplicate}
						>
							<Button type="text" icon={<CopyOutlined />} size="small">
								复制
							</Button>
						</Popconfirm>

						<Button type="text" icon={<DeleteOutlined />} size="small" onClick={delQues}>
							删除
						</Button>
					</Space>
				</div>
			</div>
		</div>
	)
}

export default QuestionCard
