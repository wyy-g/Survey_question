import { useSelector } from 'react-redux'
import { StateType } from '../store'
import { ComponentStateType } from '../store/componentReducer'

function useGetComponentStore() {
	const { componentList, selectId } = useSelector<StateType>(
		state => state.component,
	) as ComponentStateType
	const selectedComponent = componentList.find(c => c.id === selectId)
	return {
		componentList,
		selectId,
		selectedComponent,
	}
}

export default useGetComponentStore
