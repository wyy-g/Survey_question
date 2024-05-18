import React, { FC, useState, useEffect } from 'react'
import { Spin, Select } from 'antd'
import { useDispatch } from 'react-redux'
import className from 'classnames'
import styles from './EditCanvas.module.scss'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import { getComponentConfByType } from '../../../components/QuestionComponents'
import type { ComponentInfoType } from '../../../store/componentReducer'
import { changeSelectId, moveComponent } from '../../../store/componentReducer'
import EditToolbar from './EditToolbar'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import SortableComtainer from '../../../components/DragSoetable/SortableContainer'
import SortableItem from '../../../components/DragSoetable/SortableItem'
import { multiLangOptions, LanguageOption } from '../../../utools/const'

type PropsType = {
	loading: boolean
}

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

const EditCanvas: FC<PropsType> = ({ loading }) => {
	const dispatch = useDispatch()
	const { componentList = [], selectId = '' } = useGetComponentStore()
	const { isShowOrderIndex, title, description, isMultiLang, lang, defaultLang } = useGetPageInfo()

	// 删除，移动，复制等按钮的显示与隐藏
	const [hoveredId, setHoveredId] = useState<string | number>('')

	const [filterLang, setFilterLang] = useState<LanguageOption[]>([])

	useEffect(() => {
		const selectLang = multiLangOptions.filter(item => lang?.includes(item.value))
		setFilterLang(selectLang)
	}, [isMultiLang, lang, defaultLang])

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

	// 拖拽排序结束
	function handleDragEnd(oldIndex: number, newIndex: number) {
		dispatch(moveComponent({ oldIndex, newIndex }))
	}

	return (
		<SortableComtainer items={componentList} onDragEnd={handleDragEnd}>
			<div className={styles['canvas']}>
				{isMultiLang ? (
					<div className={styles['lang-select']}>
						<Select value={defaultLang} style={{ width: 120 }} options={filterLang} />
					</div>
				) : (
					<div></div>
				)}
				<div className={styles['canvas-header']}>
					<div style={{ fontWeight: 500, fontSize: '22px' }}>{title}</div>
					<div style={{ marginTop: '10px' }}>{description}</div>
				</div>
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
						<SortableItem key={id} id={id}>
							<div
								className={wrapperClassName}
								onClick={() => handleClick(id)}
								onMouseEnter={() => {
									setHoveredId(id)
								}}
								onMouseLeave={() => (hoveredId === id ? setHoveredId('') : null)}
							>
								<div className={styles['component']}>{genComponent(c, isShowOrderIndex!)}</div>
								{(id === selectId || hoveredId === id) && (
									<div className={styles['icon']}>
										<EditToolbar id={id} />
									</div>
								)}
							</div>
						</SortableItem>
					)
				})}
			</div>
		</SortableComtainer>
	)
}

export default EditCanvas
