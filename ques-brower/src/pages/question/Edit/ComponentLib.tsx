import React, { FC } from 'react'
import { useRequest } from 'ahooks'
import { Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import { getSystemComponents } from '../../../services/question'
import styles from './ComponentLib.module.scss'
import { addComponent } from '../../../store/componentReducer'
import { getComponentConfByType } from '../../../components/QuestionComponents'
import IconFont from '../../../utools/IconFont'

const ComponentLib: FC = () => {
	const { data = [] } = useRequest(getSystemComponents)
	const dispatch = useDispatch()
	function handleClick(comType: string) {
		const component = getComponentConfByType(comType)
		if (!component) return
		const { title = '', type, defaultProps } = component
		dispatch(
			addComponent({
				id: Math.floor(Math.random() * 100000),
				title,
				type,
				props: defaultProps,
			}),
		)
	}
	const groupData = data.reduce((acc: any, com: any) => {
		if (!acc[com.groupName]) {
			acc[com.groupName] = []
		}
		acc[com.groupName].push(com)
		return acc
	}, {})
	return (
		<div>
			{Object.entries(groupData).map(([groupName, groupDetailData]) => (
				<div className="componentData" key={groupName}>
					<div
						className="groupName"
						style={{ marginLeft: '20px', marginBottom: '8px', fontWeight: '700' }}
					>
						{groupName}
					</div>
					<div className="groupData">
						{(groupDetailData as []).map((com: any) => (
							<div
								key={com.id}
								className={styles['component']}
								onClick={() => handleClick(com.type)}
							>
								<Tooltip
									placement="right"
									title={<span style={{ color: '#333' }}>{com.description}</span>}
									arrow={true}
									overlayClassName={styles['toolTipStyle']}
									color="#fff"
								>
									<div style={{ marginLeft: '25px' }}>
										<IconFont type={com.icon}></IconFont>
										<span style={{ marginLeft: '15px' }}>{com.title}</span>
									</div>
								</Tooltip>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
export default ComponentLib
