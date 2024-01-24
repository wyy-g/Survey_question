import React, { FC } from 'react'
import { Space, Button } from 'antd'
import { useDispatch } from 'react-redux'
import IconFont from '../../../utools/IconFont'
import { deleteComponent, copyComponent } from '../../../store/componentReducer'

type EditToolbarProps = {
	id: string
}

const EditToolbar: FC<EditToolbarProps> = ({ id }) => {
	const dispatch = useDispatch()
	function handleDelete(e: any) {
		e.stopPropagation()
		dispatch(deleteComponent({ id }))
	}
	function handleCopy(e: any) {
		e.stopPropagation()
		dispatch(copyComponent({ id }))
	}
	return (
		<Space>
			<Button
				title="移动"
				shape="circle"
				icon={<IconFont type="icon-yidong" />}
				style={{ borderRadius: '36%' }}
			></Button>
			<Button
				title="复制"
				shape="circle"
				icon={<IconFont type="icon-fuzhi" />}
				style={{ borderRadius: '36%' }}
				onClick={e => handleCopy(e)}
			></Button>
			<Button
				title="删除"
				shape="circle"
				danger
				icon={<IconFont type="icon-shanchu" />}
				style={{ borderRadius: '36%' }}
				onClick={e => handleDelete(e)}
			></Button>
		</Space>
	)
}

export default EditToolbar
