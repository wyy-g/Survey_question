import React, { FC, useRef, useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import IconFont from '../utools/IconFont'
import { Button, Badge, Popover, Tabs, notification, Empty, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { getUserIdStorage, getToekn } from '../utools/user-storage'
import {
	getFeedNotifications,
	delFeedNoticifation,
	updateFeedbackNoticifation,
} from '../services/notification'
import styles from './inform.module.scss'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'

const Inform: FC = () => {
	const socketRef = useRef<WebSocket | null>(null)
	const userId = getUserIdStorage()
	const token = getToekn()
	const nav = useNavigate()
	const [dot, setDot] = useState(false)

	const [informtions, setInformtions] = useState([])

	const { run, loading, refresh } = useRequest(
		async userId => {
			const data = await getFeedNotifications(userId)
			return data
		},
		{
			manual: true,
			onSuccess: (data: any) => {
				setInformtions(data)
			},
		},
	)

	const { run: delRun } = useRequest(
		async notification_id => {
			await delFeedNoticifation(notification_id)
		},
		{
			manual: true,
			onSuccess: () => {
				refresh()
			},
		},
	)

	async function handleClick(survey_id: string | number, notification_id: string | number) {
		nav(`/question/stat/${survey_id}`)
		await updateFeedbackNoticifation(notification_id)
	}

	function handleDel(e: any, notification_id: number | string) {
		e.stopPropagation()
		delRun(notification_id)
	}

	useEffect(() => {
		run(userId)
		if (!socketRef.current) {
			// 创建WebSocket连接
			const socketUrl =
				process.env.NODE_ENV === 'production'
					? `${process.env.REACT_APP_WS_URL}/feedback-notifications`
					: `ws://localhost:3031/feedback-notifications`
			const query = token && userId ? `?token=${encodeURIComponent(token)}&userId=${userId}` : ''

			socketRef.current = new WebSocket(socketUrl + query)
		}
		// 监听WebSocket连接建立事件
		socketRef.current.addEventListener('open', () => {
			console.log('WebSocket连接已建立')
		})

		socketRef.current.addEventListener('message', event => {
			const messageData = JSON.parse(event.data)
			if (messageData) {
				run(userId)
				setDot(true)
			}
			notification.info({
				message: messageData.action == 'new_feedback' ? '问卷反馈建议' : '系统提示',
				description: messageData.action == 'new_feedback' ? messageData.message : '系统提示',
				// onClick: () => {
				// 	nav(`/question/stat/${messageData.survey_id}`)
				// },
			})
			// 检查是否为新的反馈消息
		})
		// return () => {
		// 	if (socketRef.current!.readyState === WebSocket.OPEN) {
		// 		socketRef.current!.close()
		// 	}
		// }
	}, [])

	useEffect(() => {
		const noRead = informtions.find((item: any) => !item.is_read)
		if (noRead) {
			setDot(true)
		} else {
			setDot(false)
		}
	}, [informtions])

	const innerElem = () => {
		const onClick: MenuProps['onClick'] = ({ key }) => {
			if (key === 'allRead') {
				console.log('allRead')
			} else if (key === 'alldelete') {
				console.log('alldelete')
			}
		}

		const items: MenuProps['items'] = [
			{
				label: <span>全部已读</span>,
				key: 'allRead',
			},
			{
				label: <span>全部删除</span>,
				key: 'alldelete',
			},
		]

		const tabsColumns = [
			{
				key: 'unread',
				label: (
					<span style={{ marginLeft: '15px' }}>
						<span style={{ marginLeft: '-7px' }}>未读消息</span>
					</span>
				),
				children: (
					<>
						{informtions.length > 0 ? (
							<div className={styles['inform-wrapper']}>
								{informtions.map((inform, index) => {
									const { notification_id, is_read, message, created_at, survey_id } = inform
									return (
										<>
											{is_read ? (
												// <Empty description="暂无未读消息" />
												''
											) : (
												<Badge dot={!is_read} key={notification_id + String(index)}>
													<div
														className={styles['inform-card']}
														onClick={() => handleClick(survey_id, notification_id)}
													>
														<div className={styles['header']}>
															<span style={{ fontSize: '15px' }}>问卷反馈通知</span>
															<IconFont
																type="icon-error"
																className={styles['hidden-icon']}
																onClick={e => handleDel(e, notification_id)}
															/>
														</div>
														<span className={styles['message']}>{message}</span>
														<span style={{ marginTop: '5px', color: '#aaa', fontSize: '12px' }}>
															{moment.utc(created_at).local().format('YYYY-MM-DD HH:mm:ss')}
														</span>
													</div>
												</Badge>
											)}
										</>
									)
								})}
							</div>
						) : (
							<Empty description="暂无未读消息" />
						)}
					</>
				),
			},
			{
				key: 'all',
				label: (
					<span style={{ marginLeft: '15px' }}>
						<span style={{ marginLeft: '-7px' }}>全部消息</span>
					</span>
				),
				children: (
					<>
						{informtions.length > 0 ? (
							<div className={styles['inform-wrapper']}>
								{informtions.map((inform, index) => {
									const { notification_id, is_read, message, created_at, survey_id } = inform
									return (
										<Badge dot={!is_read} key={notification_id + String(index)}>
											<div
												className={styles['inform-card']}
												onClick={() => handleClick(survey_id, notification_id)}
											>
												<div className={styles['header']}>
													<span style={{ fontSize: '15px' }}>问卷反馈通知</span>
													<IconFont
														type="icon-error"
														className={styles['hidden-icon']}
														onClick={e => handleDel(e, notification_id)}
													/>
												</div>
												<span className={styles['message']}>{message}</span>
												<span style={{ marginTop: '5px', color: '#aaa', fontSize: '12px' }}>
													{moment.utc(created_at).local().format('YYYY-MM-DD HH:mm:ss')}
												</span>
											</div>
										</Badge>
									)
								})}
							</div>
						) : (
							<Empty description="暂无消息" />
						)}
					</>
				),
			},
		]
		return (
			<div style={{ display: 'flex', width: '350px' }}>
				<Tabs items={tabsColumns} style={{ flexGrow: 1 }} />
				<Dropdown placement="bottom" menu={{ items, onClick }}>
					<Button
						type="text"
						icon={<IconFont type="icon-shezhi" />}
						style={{
							position: 'absolute',
							right: '20px',
							top: '20px',
							bottom: 0,
							borderLeft: '1px solid #DCDFE6',
						}}
					>
						设置
					</Button>
				</Dropdown>
			</div>
		)
	}

	return (
		<>
			<Popover trigger="click" arrow={false} content={innerElem}>
				<Badge dot={dot}>
					<Button
						type="text"
						icon={<IconFont type="icon-tongzhi" style={{ fontSize: '24px' }} />}
						// onClick={() => run(userId)}
					></Button>
				</Badge>
			</Popover>
		</>
	)
}

export default Inform
