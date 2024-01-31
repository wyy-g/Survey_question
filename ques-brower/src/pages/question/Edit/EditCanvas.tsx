import React, { FC, useState } from 'react'
import { Spin } from 'antd'
import { useDispatch } from 'react-redux'
import className from 'classnames'
import styles from './EditCanvas.module.scss'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import { getComponentConfByType } from '../../../components/QuestionComponents'
import { ComponentInfoType } from '../../../store/componentReducer'
import { changeSelectId } from '../../../store/componentReducer'
import EditToolbar from './EditToolbar'

type PropsType = {
	loading: boolean
}

function genComponent(componentInfo: ComponentInfoType) {
	const { type, props, title } = componentInfo
	const componentConf = getComponentConfByType(type)
	if (!componentConf) return
	const { Component } = componentConf
	const newProps = {
		...props,
		title,
	}
	return <Component {...newProps} />
}

const EditCanvas: FC<PropsType> = ({ loading }) => {
	const dispatch = useDispatch()
	const { componentList = [], selectId = '' } = useGetComponentStore()

	// 删除，移动，复制等按钮的显示与隐藏
	const [hoveredId, setHoveredId] = useState<string | number>('')

	function handleClick(id: string | number) {
		dispatch(changeSelectId(id))
	}

	if (loading) {
		return (
			<div style={{ textAlign: 'center', marginTop: '24px' }}>
				<Spin></Spin>
			</div>
		)
	}
	return (
		<div className={styles['canvas']}>
			{componentList.map((c: any) => {
				const { id } = c

				//拼接classnames
				const wrapperDefaultClassName = styles['component-wrapper']
				const selectedIdClassName = styles['selectedId']
				const wrapperClassName = className({
					[wrapperDefaultClassName]: true,
					[selectedIdClassName]: id === selectId,
				})
				return (
					<div
						key={id}
						className={wrapperClassName}
						onClick={() => handleClick(id)}
						onMouseEnter={() => {
							setHoveredId(id)
						}}
						onMouseLeave={() => (hoveredId === id ? setHoveredId('') : null)}
					>
						<div className={styles['component']}>{genComponent(c)}</div>
						{(id === selectId || hoveredId === id) && (
							<div className={styles['icon']}>
								<EditToolbar id={id} />
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default EditCanvas
