import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import { getComponentConfByType, ComponentPropsType } from '../../../components/QuestionComponents'
import { changeComponentProps } from '../../../store/componentReducer'

const ComponentProp: FC = () => {
	const { selectedComponent } = useGetComponentStore()
	const dispatch = useDispatch()
	if (selectedComponent == null) return <div style={{ textAlign: 'center' }}>未选中组件</div>

	const { type, props, title } = selectedComponent!
	const componentConf = getComponentConfByType(type)
	if (componentConf == null) return <div style={{ textAlign: 'center' }}>未选中组件</div>

	const { PropComponent } = componentConf!

	function changeProps(newProps: ComponentPropsType) {
		if (selectedComponent == null) return
		const { id } = selectedComponent
		// 如果是undefined的话没有传给后端，后端没做处理，所以在前端赋值为空字符串在前端做处理了
		if (!newProps.value) {
			newProps.value = ''
		}
		dispatch(changeComponentProps({ id, newProps }))
	}

	const newProps = {
		...props,
		title,
	}

	return <PropComponent {...newProps} onChange={changeProps} />
}

export default ComponentProp
