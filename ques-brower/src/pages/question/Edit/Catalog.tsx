import React, { ChangeEvent, FC, useState } from 'react'
import className from 'classnames'
import { useDispatch } from 'react-redux'
import { Button, Input } from 'antd'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import {
	changeSelectId,
	changeComponentTitle,
	changeHiddenComponent,
} from '../../../store/componentReducer'
import styles from './Catalog.module.scss'
import IconFont from '../../../utools/IconFont'

const Catalog: FC = () => {
	const dispatch = useDispatch()
	// 记录当前正在修改标题的组件
	const [changeTitleId, setChangeTitleId] = useState<string | number>('')
	const { componentList, selectId } = useGetComponentStore()
	function addZero(num: number) {
		if (num < 10) {
			return '0' + num
		}
	}

	function handleClick(id: number | string) {
		if (id !== selectId) {
			// 当前组件未被选中执行选中
			dispatch(changeSelectId(id))
			setChangeTitleId('')
			return
		}
		//点击修改标题
		setChangeTitleId(id)
	}

	// 修改biaoti
	function changeTitle(e: ChangeEvent<HTMLInputElement>) {
		const newTitle = e.target.value.trim()
		if (!newTitle) return
		if (!selectId) return
		dispatch(changeComponentTitle({ id: selectId, title: newTitle }))
	}

	// 切换隐藏显示
	function changeHidden(e: any, id: string | number, isShow: boolean) {
		e.stopPropagation()
		dispatch(changeHiddenComponent({ id, isShow }))
	}

	return (
		<>
			{componentList.map(c => {
				const { id, title, order_index, props } = c
				const { isShow = false } = props

				const wrapperDefaultClassName = styles['title-wrapper']
				const selectedIdClassName = styles['selectedId']
				const wrapperClassName = className({
					[wrapperDefaultClassName]: true,
					[selectedIdClassName]: id === selectId,
				})

				return (
					<div key={id} className={wrapperClassName} onClick={() => handleClick(id)}>
						<div className={styles['title']}>
							{' '}
							{id !== changeTitleId && (
								<span>
									{addZero(order_index!)}.&nbsp;{title}
								</span>
							)}
							{id === changeTitleId && (
								<Input
									value={title}
									onChange={e => changeTitle(e)}
									onPressEnter={() => setChangeTitleId('')}
									onBlur={() => setChangeTitleId('')}
									size="small"
								/>
							)}
						</div>
						<div className={styles['handler']}>
							{!isShow ? (
								<Button
									type="text"
									size="small"
									icon={<IconFont type="icon-yanjing_xianshi_o"></IconFont>}
									title="隐藏组件"
									onClick={e => changeHidden(e, id, !isShow)}
								></Button>
							) : (
								<Button
									type="text"
									size="small"
									icon={<IconFont type="icon-yanjing_yincang_o"></IconFont>}
									title="显示组件"
									onClick={e => changeHidden(e, id, !isShow)}
								></Button>
							)}
						</div>
					</div>
				)
			})}
		</>
	)
}

export default Catalog
