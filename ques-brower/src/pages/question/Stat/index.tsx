import React, { FC } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import styles from './index.module.scss'
import IconFont from '../../../utools/IconFont'
import Report from './report'
import Statistics from './statistics'

const Stat: FC = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()
	const { id } = useParams()

	return (
		<div className={styles['stat']}>
			<div className={styles['menu-list']}>
				<div className={styles['menu-item']} onClick={() => nav(`/question/stat/${id}`)}>
					<Button
						type={pathname === `/question/stat/${id}` ? 'link' : 'text'}
						icon={<IconFont type="icon-tongjifenxi-xiangmubiaogetongji" />}
						size="large"
					></Button>
					<span style={{ fontSize: '12px' }}>统计</span>
				</div>
				<div className={styles['menu-item']} onClick={() => nav(`/question/stat/${id}/report`)}>
					<Button
						type={pathname === `/question/stat/${id}/report` ? 'link' : 'text'}
						icon={<IconFont type="icon-baobiao" />}
						size="large"
					></Button>
					<span style={{ fontSize: '12px' }}>报表</span>
				</div>
			</div>
			<div className={styles['container']}>
				{pathname === `/question/stat/${id}/report` && <Report />}
				{pathname === `/question/stat/${id}` && <Statistics />}
			</div>
		</div>
	)
}

export default Stat
