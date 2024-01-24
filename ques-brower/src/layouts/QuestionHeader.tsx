import React, { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Button, Typography, Space } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import styles from './QuestionHeader.module.scss'
import IconFont from '../utools/IconFont'

const { Title } = Typography

const Header: FC = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()
	const match = pathname.match(/\/(\w+)\/(\d+)/)!
	const page = match[1]
	const id = match[2]
	return (
		<div className={styles['header-wrapper']}>
			<div className={styles['header']}>
				<div className={styles['left']}>
					<Space>
						<Button type="link" icon={<LeftOutlined />} onClick={() => nav('/manage/list')}>
							返回
						</Button>
						<Title>问卷标题</Title>
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
