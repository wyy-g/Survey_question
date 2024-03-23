import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Input, Modal, Tooltip, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './QuestionHeader.module.scss'
import { useRequest, useKeyPress, useDebounceEffect } from 'ahooks'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
/* eslint-enable */
import IconFont from '../utools/IconFont'
import useGetPageInfo from '../hooks/useGetPageInfo'
import useGetComponentStore from '../hooks/useGetComponentStore'
import { changePageTitle, changePageIsPushlished } from '../store/pageInfoReducer'
import { updateQuesService } from '../services/question'
import { ComponentInfoType } from '../store/componentReducer'
import { getComponentConfByType } from '../components/QuestionComponents'

const Header: FC = () => {
	const {
		title,
		isShowOrderIndex,
		description,
		isPublished = '',
		startTime,
		endTime,
		isEnableFeedback,
	} = useGetPageInfo()
	const dispatch = useDispatch()
	const { componentList = [] } = useGetComponentStore()
	const nav = useNavigate()
	const { pathname } = useLocation()
	const match = pathname.match(/\/(\w+)\/(\d+)/)!
	const page = match[1]
	const id = match[2]

	const { loading, run: save } = useRequest(
		async () => {
			await updateQuesService(Number(id), {
				title,
				isShowOrderIndex,
				description,
				componentList,
				isPublished,
				updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				isEnableFeedback,
			})
		},
		{ manual: true },
	)

	useKeyPress(['ctrl.s', 'meta.s'], (event: KeyboardEvent) => {
		event.preventDefault()
		if (loading) return
		save()
	})

	// 自动保存（防抖）
	useDebounceEffect(
		() => {
			if (page == 'edit') {
				save()
			}
		},
		[componentList, title, description, isShowOrderIndex, isEnableFeedback],
		{
			wait: 1000,
		},
	)

	const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
	const formateStartTime = startTime
		? moment.utc(startTime).local().format('YYYY-MM-DD HH:mm:ss')
		: currentTime
	const formateEndTime = endTime
		? moment.utc(endTime).local().format('YYYY-MM-DD HH:mm:ss')
		: moment().clone().add(15, 'days').format('YYYY-MM-DD HH:mm:ss')
	// 发布按钮
	const PublishButton: FC = () => {
		const { run: publish } = useRequest(
			async (status: boolean, startTime?: string, endTime?: string) => {
				const validStartTime = startTime ? startTime : formateStartTime
				const validEndTime = endTime ? endTime : formateEndTime
				await updateQuesService(Number(id), {
					title,
					isShowOrderIndex,
					description,
					componentList,
					isPublished: status,
					updatedAt: currentTime,
					startTime: validStartTime,
					endTime: validEndTime,
				})
			},
			{ manual: true },
		)

		return (
			<>
				{isPublished ? (
					<Tooltip
						placement="right"
						title={
							<span style={{ color: '#fff' }}>用户将无法查看和填写当前表单停止后仍再可开启</span>
						}
						arrow={true}
						overlayClassName={styles['toolTipStyle']}
						color="#ff4d4f"
					>
						<Button
							icon={<IconFont type="icon-jian" />}
							type="primary"
							danger
							onClick={() => {
								publish(false)
								dispatch(changePageIsPushlished(false))
								message.success('已停止发布')
							}}
						>
							停止
						</Button>
					</Tooltip>
				) : (
					<Button
						icon={<IconFont type="icon-wodefabu-baise" />}
						type="primary"
						onClick={() => {
							publish(true, formateStartTime, formateEndTime)
							dispatch(changePageIsPushlished(true))
							message.success('发布成功')
						}}
					>
						发布
					</Button>
				)}
			</>
		)
	}

	// 修改标题的组件
	const TitleElem: FC = () => {
		// 获取问卷信息
		// 显示输入框还是标题
		const [editState, setEditState] = useState(false)
		function handleChange(e: ChangeEvent<HTMLInputElement>) {
			const newTitle = e.target.value.trim()
			if (!newTitle) return
			dispatch(changePageTitle(newTitle))
		}

		return (
			<>
				{editState ? (
					<Input
						value={title}
						size="small"
						onPressEnter={() => setEditState(false)}
						onBlur={() => setEditState(false)}
						onChange={e => handleChange(e)}
					/>
				) : (
					<Space>
						<span style={{ fontSize: '14px' }}>{title}</span>
						<Button
							size="small"
							type="text"
							icon={<IconFont type="icon-bianji" />}
							onClick={() => setEditState(true)}
						></Button>
					</Space>
				)}
				<div style={{ fontSize: '12px' }}>
					表单内容自动保存&nbsp;
					{loading ? <IconFont type="icon-loading" /> : <IconFont type="icon-duihao" />}
				</div>
			</>
		)
	}

	// todo 问卷收集得答案（要去掉预览不计入答案回收中）
	// const [writeAnswer, setWriteAnswer] = useState<{ id: string | number; value: string }[]>([])
	const writeAnswer: any = []

	// 预览组件
	const [openPriview, setOpenPriview] = useState(false)
	const PreviewElem: FC = () => {
		function handleValueChange(value: string | number, id: string | number) {
			// setWriteAnswer([...writeAnswer, { id, value }])
			const answer = writeAnswer.find((a: any) => a.id === id)
			if (answer) {
				answer.value = value
			} else {
				writeAnswer.push({ id, value })
			}
		}
		const [device, setDevice] = useState('pc')
		function genComponent(
			componentInfo: ComponentInfoType,
			isShowOrderIndex: boolean,
			isShowWarning: boolean,
		) {
			const { type, props, title, order_index, id } = componentInfo
			const componentConf = getComponentConfByType(type)
			if (!componentConf) return
			const { Component } = componentConf
			const newProps = {
				...props,
				title,
				order_index,
				isShowOrderIndex,
				isShowWarning,
			}
			return <Component {...newProps} onValueChange={value => handleValueChange(value, id)} />
		}

		// 子组件是否必填状态下是否显示警告
		const [childWarnings, setChildWarnings] = useState<{ [key: string | number]: boolean }>({})
		// 验证所有子组件的输入值
		const validateForm = () => {
			let hasEmptyField = false
			// 每个子组件是否要显示警告
			const newChildWarnings: { [key: string | number]: boolean } = {}

			for (const component of componentList) {
				if (
					component.props.isMustFill &&
					!writeAnswer.some((answer: any) => answer.id === component.id && answer.value)
				) {
					newChildWarnings[component.id] = true
					hasEmptyField = true
				} else {
					newChildWarnings[component.id] = false
				}
			}

			setChildWarnings(newChildWarnings)

			if (hasEmptyField) {
				console.warn('存在必填项未填写')
			}
		}

		return (
			<Modal
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflowY: 'auto', // 添加滚动条以处理内容过长
					maxWidth: '100vw',
					height: '100vh',
					backgroundColor: '#F8F8F8',
				}}
				styles={{
					body: {
						height: 'calc(100vh - 55px - 17px)',
						overflowY: 'auto',
						maxWidth: '100vw',
						backgroundColor: '#F8F8F8',
					},
				}}
				title="预览"
				centered
				open={openPriview}
				onCancel={() => setOpenPriview(false)}
				width="100vw"
				footer={null}
			>
				<div className={styles['preview']}>
					<div className={styles['preview-pattern']}>
						<Space>
							<Button
								type={device == 'pc' ? 'primary' : 'default'}
								icon={<IconFont type="icon-pc" />}
								onClick={() => setDevice('pc')}
							>
								PC端
							</Button>
							<Button
								type={device == 'mobile' ? 'primary' : 'default'}
								icon={<IconFont type="icon-shouji" />}
								onClick={() => setDevice('mobile')}
							>
								移动端
							</Button>
						</Space>
					</div>
					<div className={device == 'mobile' ? styles['preview-content-mobile-wrapper'] : ''}>
						<div
							className={
								device == 'pc' ? styles['preview-content'] : styles['preview-content-mobile']
							}
						>
							{device == 'pc' ? (
								<div className={styles['header']}>
									<div style={{ fontWeight: 500, fontSize: '22px' }}>{title}</div>
									<div style={{ marginTop: '10px', fontSize: '16px' }}>{description}</div>
								</div>
							) : (
								<div className={styles['header-mobile']}>
									<div style={{ fontWeight: 500, fontSize: '18px' }}>{title}</div>
									<div style={{ marginTop: '5px', fontSize: '14px' }}>{description}</div>
								</div>
							)}

							{componentList.map((c: any) => {
								const { id } = c
								return (
									<div className={styles['component-wrapper']} key={id}>
										<div
											className={device == 'pc' ? styles['component'] : styles['component-mobile']}
										>
											{genComponent(c, isShowOrderIndex!, childWarnings[c.id])}
										</div>
									</div>
								)
							})}
							<div className={styles['footer']}>
								<Button type="primary" onClick={validateForm}>
									提交
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		)
	}

	return (
		<div className={styles['header-wrapper']}>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<Space>
						<Button type="link" icon={<LeftOutlined />} onClick={() => nav('/manage/list')}>
							返回
						</Button>
						<div className={styles['title']}>
							<TitleElem />
						</div>
					</Space>
				</div>
				<div className={styles['main']}>
					<Button
						type={'link'}
						style={{ color: page === 'edit' ? '' : '#333' }}
						onClick={() => nav(`edit/${id}`)}
						icon={<IconFont type="icon-bianji" />}
					>
						编辑
					</Button>
					<Button
						type={'link'}
						style={{ color: page === 'publish' ? '' : '#333' }}
						onClick={() => nav(`publish/${id}`)}
						icon={<IconFont type="icon-fabudaochuzhuomiankuaijie" />}
					>
						发布
					</Button>
					<Button
						type={'link'}
						style={{ color: page === 'stat' ? '' : '#333' }}
						onClick={() => nav(`stat/${id}`)}
						icon={<IconFont type="icon-tongji" />}
					>
						统计
					</Button>
				</div>
				<div className={styles['right']}>
					<Space>
						<Button icon={<IconFont type="icon-shida" />} onClick={() => setOpenPriview(true)}>
							预览
						</Button>
						<PublishButton />
					</Space>
				</div>
			</div>
			{openPriview && <PreviewElem />}
		</div>
	)
}

export default Header
