import React, { ChangeEvent, FC, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Input } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './QuestionHeader.module.scss'
import IconFont from '../utools/IconFont'
import useGetPageInfo from '../hooks/useGetPageInfo'
import { changePageTitle } from '../store/pageInfoReducer'

const Header: FC = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()
	const match = pathname.match(/\/(\w+)\/(\d+)/)!
	const page = match[1]
	const id = match[2]

	// 修改标题的组件
	const TitleElem: FC = () => {
		// 获取问卷信息
		const { title } = useGetPageInfo()
		// 显示输入框还是标题
		const [editState, setEditState] = useState(false)
		const dispatch = useDispatch()

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
				<div style={{ fontSize: '12px' }}>问卷自动保存</div>
			</>
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
					<Space></Space>
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
						style={{ color: page === 'stat' ? '' : '#333' }}
						onClick={() => nav(`stat/${id}`)}
						icon={<IconFont type="icon-tongji" />}
					>
						统计
					</Button>
				</div>
				<div className={styles['right']}>
					<Space>
						<Button icon={<IconFont type="icon-shida" />}>试答问卷</Button>
						<Button icon={<IconFont type="icon-wodefabu-baise" />} type="primary">
							一键发布
						</Button>
					</Space>
				</div>
			</div>
		</div>
	)
}

export default Header
