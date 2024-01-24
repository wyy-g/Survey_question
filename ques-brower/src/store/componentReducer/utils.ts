import { ComponentInfoType } from './index'
export function getNextSelected(id: string | number, componentList: ComponentInfoType[]) {
	const index = componentList.findIndex(c => c.id === id)
	if (index < 0) return ''
	// 重新计算selectId
	let newSelectId: string | number = ''
	const length = componentList.length
	if (length <= 1) {
		// 组件长度就一个，被删掉就没有了
		newSelectId = ''
	} else {
		// 组件长度 > 1
		if (index + 1 === length) {
			//要删除最后一个，就要选中上一个
			newSelectId = componentList[index - 1].id
		} else {
			// 要删除的不是最后一个，删除以后要选中下一个
			newSelectId = componentList[index + 1].id
		}
	}

	return newSelectId
}
