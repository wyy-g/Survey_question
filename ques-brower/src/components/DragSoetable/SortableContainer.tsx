import React, { FC } from 'react'
import {
	DndContext,
	closestCenter,
	MouseSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core'

import {
	//arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'

type PropsType = {
	children: JSX.Element | JSX.Element[]
	items: Array<{ id: string | number; [key: string]: any }>
	onDragEnd: (oldIndex: number, newIndex: number) => void
}

const SortableComtainer: FC<PropsType> = (props: PropsType) => {
	const { children, items, onDragEnd } = props
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8, //8px
			},
		}),
	)
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (active.id !== over!.id) {
			const oldIndex = items.findIndex(c => c.id == active.id)
			const newIndex = items.findIndex(c => c.id == over!.id)
			onDragEnd(oldIndex, newIndex)
		}
	}
	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{children}
			</SortableContext>
		</DndContext>
	)
}

export default SortableComtainer
