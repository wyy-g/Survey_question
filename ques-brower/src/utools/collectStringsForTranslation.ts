/**
 *
 * @param jsonData 把对象的value取出来，转换成数组形式，如 [ value1, value2 ]
 * @param path 对象的key，将翻译api得到的[value1, value2]转成对象的时候需要用到，初始值是空
 * @returns {texts: ['', ''], paths}
 */
export function collectStringsForTranslation<T extends object>(
	jsonData: T,
	path = '',
): { texts: string[]; paths: string[] } {
	const collector: string[] = []
	const paths: string[] = []

	const collect = (currentData: any, currentPath: string) => {
		if (typeof currentData === 'object' && currentData !== null) {
			for (const key in currentData) {
				// 添加条件来跳过键名为 'type' 的情况
				if (key === 'type') continue

				const newPath = currentPath ? `${currentPath}.${key}` : key
				if (typeof currentData[key] === 'string') {
					collector.push(currentData[key])
					paths.push(newPath)
				} else {
					collect(currentData[key], newPath)
				}
			}
		}
	}

	collect(jsonData, path)
	return { texts: collector, paths }
}

/**
 * 根据路径将翻译后的文本替换回原JSON对象。
 * @param jsonData 需要替换的原始JSON对象。
 * @param map 翻译后的文本与路径的映射关系。
 */
export function replaceTextInDataStructure(
	data: any,
	translationMap: Record<string, string>,
	pathPrefix: string = '',
): any {
	// 遍历 JSON 数据结构
	for (const key in data) {
		if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
			// 递归处理对象
			replaceTextInDataStructure(data[key], translationMap, pathPrefix + key + '.')
		} else if (Array.isArray(data[key])) {
			// 处理数组
			data[key].forEach((item: any, index: any) => {
				replaceTextInDataStructure(item, translationMap, pathPrefix + key + `.${index}.`)
			})
		} else if (typeof data[key] === 'string' && Object.hasOwn(translationMap, pathPrefix + key)) {
			// 更新文本
			data[key] = translationMap[pathPrefix + key]
		}
	}

	return data
}
