import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import useGetComponentStore from '../../../hooks/useGetComponentStore'
import { getComponentConfByType, ComponentPropsType } from '../../../components/QuestionComponents'
import { changeComponentProps } from '../../../store/componentReducer'

const ComponentProp: FC = () => {
	const { selectedComponent } = useGetComponentStore()
	const dispatch = useDispatch()
	if (selectedComponent == null) return <div style={{ textAlign: 'center' }}>未选中组件</div>

	const { type, props } = selectedComponent!
	const componentConf = getComponentConfByType(type)
	if (componentConf == null) return <div style={{ textAlign: 'center' }}>未选中组件</div>

	const { PropComponent } = componentConf!

	function changeProps(newProps: ComponentPropsType) {
		if (selectedComponent == null) return
		const { id } = selectedComponent
		console.log('id', id)
		dispatch(changeComponentProps({ id, newProps }))
	}

	return <PropComponent {...props} onChange={changeProps} />
}

export default ComponentProp
