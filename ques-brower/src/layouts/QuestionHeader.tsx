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
	const { title, isShowOrderIndex, description, isPublished = '' } = useGetPageInfo()
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
			save()
		},
		[componentList, title, description, isShowOrderIndex, isPublished],
		{
			wait: 1000,
		},
	)

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

	// 预览组件
	const [openPriview, setOpenPriview] = useState(false)
	const PreviewElem: FC = () => {
		function genComponent(componentInfo: ComponentInfoType, isShowOrderIndex: boolean) {
			const { type, props, title, order_index } = componentInfo
			const componentConf = getComponentConfByType(type)
			if (!componentConf) return
			const { Component } = componentConf
			const newProps = {
				...props,
				title,
				order_index,
				isShowOrderIndex,
			}
			return <Component {...newProps} />
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
							<Button>PC端</Button>
							<Button>移动端</Button>
						</Space>
					</div>
					<div className={styles['preview-content']}>
						<div className={styles['header']}>
							<div style={{ fontWeight: 500, fontSize: '22px' }}>{title}</div>
							<div style={{ marginTop: '10px', fontSize: '16px' }}>{description}</div>
						</div>
						{componentList.map((c: any) => {
							const { id } = c
							return (
								<div className={styles['component-wrapper']} key={id}>
									<div className={styles['component']}>{genComponent(c, isShowOrderIndex!)}</div>
								</div>
							)
						})}
						<div className={styles['footer']}>
							<Button type="primary">提交</Button>
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
						{isPublished ? (
							<Tooltip
								placement="right"
								title={
									<span style={{ color: '#fff' }}>
										用户将无法查看和填写当前表单停止后仍再可开启
									</span>
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
									dispatch(changePageIsPushlished(true))
									message.success('发布成功')
								}}
							>
								发布
							</Button>
						)}
					</Space>
				</div>
			</div>
			{openPriview && <PreviewElem />}
		</div>
	)
}

export default Header
