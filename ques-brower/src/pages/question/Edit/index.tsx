import React, { FC } from 'react'
import styles from './index.module.scss'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import EditCanvas from './EditCanvas'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'

const Edit: FC = () => {
	const { loading } = useLoadQuestionData()
	return (
		<div className={styles['container']}>
			{/* <div>
				<Header />
			</div> */}
			<div className={styles['content-wrapper']}>
				<div className={styles['content']}>
					<div className={styles['left']}>
						<LeftPanel />
					</div>
					<div className={styles['main']}>
						<div className={styles['canvas-wrapper']}>
							<EditCanvas loading={loading} />
						</div>
					</div>
					<div className={styles['right']}>
						<RightPanel />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Edit
