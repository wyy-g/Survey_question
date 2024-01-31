import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'
import { ComponentPropsType } from '../../components/QuestionComponents'
import { getNextSelected } from './utils'
import { nanoid } from 'nanoid'

// 单个组件的信息
export type ComponentInfoType = {
	id: number | string
	title: string
	type: string
	order_index?: number
	component_id?: number
	props: ComponentPropsType
}

// 问卷中所有组件的信息（组件列表）
export type ComponentStateType = {
	selectId: string | number
	componentList: ComponentInfoType[]
}

// 初始值
const INIT_STATE: ComponentStateType = {
	selectId: '',
	componentList: [],
}

export const componentsSlice = createSlice({
	name: 'components',
	initialState: INIT_STATE,
	reducers: {
		// 重置所有组件
		resetComponents: (state: ComponentStateType, action: PayloadAction<ComponentStateType>) => {
			return action.payload
		},
		// 修改选中的组件
		changeSelectId: produce((draft: ComponentStateType, action: PayloadAction<string | number>) => {
			draft.selectId = action.payload
		}),
		//添加新组件
		addComponent: produce((draft: ComponentStateType, action: PayloadAction<ComponentInfoType>) => {
			const newComponent = action.payload
			const { selectId, componentList } = draft
			const index = componentList.findIndex(c => c.id === selectId)
			if (index < 0) {
				// 未选中任何组件
				draft.componentList.push({ ...newComponent, order_index: componentList.length + 1 })
			} else {
				// 选中了组件，插入到index后
				draft.componentList.splice(index + 1, 0, { ...newComponent, order_index: index + 1 })
			}
			draft.selectId = newComponent.id
		}),
		// 修改组件属性
		changeComponentProps: produce(
			(
				draft: ComponentStateType,
				action: PayloadAction<{ id: string | number; newProps: ComponentPropsType }>,
			) => {
				const { id, newProps } = action.payload
				// 当前要修改属性的组件
				const curCom = draft.componentList.find(c => c.id === id)
				// if (curCom) {
				// 	curCom.props = {
				// 		...curCom.props,
				// 		...newProps,
				// 	}
				// }
				if (curCom) {
					curCom.props = {
						...curCom.props,
						...newProps,
					}
					curCom.title = newProps.title!
				}
			},
		),
		// 删除组件
		deleteComponent: produce(
			(draft: ComponentStateType, action: PayloadAction<{ id: string | number }>) => {
				const { componentList } = draft
				// 重新计算选中的id
				const newSelectId = getNextSelected(action.payload.id, componentList)
				draft.selectId = newSelectId
				const index = componentList.findIndex(c => c.id === action.payload.id)
				componentList.splice(index, 1)
			},
		),
		// 复制组件
		copyComponent: produce(
			(draft: ComponentStateType, action: PayloadAction<{ id: string | number }>) => {
				const { componentList } = draft
				// 先找到要复制的组件
				const copy_com = componentList.find(c => c.id === action.payload.id)
				if (!copy_com) return
				// 找到复制组件的位置
				const index = componentList.findIndex(c => c.id === action.payload.id)
				const newComponent = {
					...copy_com,
					id: nanoid(5),
					order_index: index + 1,
				}
				// 将组件插入到组件列表中
				draft.componentList.splice(index + 1, 0, newComponent)
				// 重新计算选中ID
				draft.selectId = newComponent.id
			},
		),
		// 修改组件标题
		changeComponentTitle: produce(
			(
				draft: ComponentStateType,
				action: PayloadAction<{ id: string | number; title: string }>,
			) => {
				const { id, title } = action.payload
				const curCom = draft.componentList.find(c => c.id === id)
				if (curCom) {
					curCom.title = title
				}
			},
		),
		// 切换隐藏显示
		changeHiddenComponent: produce(
			(
				draft: ComponentStateType,
				action: PayloadAction<{ id: string | number; isShow: boolean }>,
			) => {
				const { id, isShow } = action.payload
				const curCom = draft.componentList.find(c => c.id === id)
				if (curCom) {
					curCom.props.isShow = isShow
				}
			},
		),
	},
})

export const {
	resetComponents,
	changeSelectId,
	addComponent,
	changeComponentProps,
	deleteComponent,
	copyComponent,
	changeComponentTitle,
	changeHiddenComponent,
} = componentsSlice.actions
export default componentsSlice.reducer
