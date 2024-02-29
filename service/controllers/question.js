const {
	createOneQues,
	getUserAllQues,
	getQuesTotal,
	getUserStarQues,
	getUserDelQues,
	hidQuse,
	setStarStatusModel,
	recoverQuesModel,
	delQuesModel,
	searchQuesModel,
	sortQuesModel,
	getSearchQuesTotal,
	getPublishedQuesTotal,
	updateQuestionModel,
	getQuesInfoModel,
	copyQuestionModel,
	getQuestionComponents,
} = require('../models/question')
const {
	getComponentComplexPropModel,
	updateComponentModel,
	getSingleCom,
	getSingleSystemCom,
	addComInfo,
	getSingleComProp,
	updateComponentPropModel,
	addComPropInfo,
	addOptionItem,
	getComplexPropOption,
	updateComplexPropOption,
	delComModel,
	delOptionModel
} = require('../models/questionCom')
const { isHaveUser, isHaveQues } = require('../models/common')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes')

exports.createQues = async (req, res) => {
	const {
		title,
		description = null,
		userId
	} = req.body

	const isPublished = req.body.isPublished === 'true' || req.body.isPublished > 0
	const isStar = req.body.isStar === 'true' || req.body.isStar > 0
	const isDeleted = req.body.isStar === 'true' || req.body.isDeleted > 0

	if (!title) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'title 不能为空'
		})
	}

	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	try {
		const userData = await isHaveUser(Number(userId))
		if (userData.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '该用户不存在'
			})
		}

		const result = await createOneQues(title, description, isPublished, isStar, isDeleted, Number(userId))
		res.status(CREATED).send({
			code: OK,
			data: {
				id: result.insertId
			},
			msg: '创建问卷成功'
		})
	} catch (err) {
		console.log(err)
		res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务器内部错误'
		})
	}
}

// 获取某个用户的所有问卷列表
exports.getUserQuesList = async (req, res) => {
	const { userId, isPublished } = req.query

	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	if (typeof Number(userId) !== 'number') {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不是一个数字'
		})
	}

	const userData = await isHaveUser(Number(userId))
	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户不存在'
		})
	}

	try {
		const userAllQues = await getUserAllQues(Number(userId), req.offset, req.pageSize, isPublished)
		// 获取问卷的未删除的数量
		const total = await getQuesTotal(Number(userId))
		if (userAllQues.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '暂时还没有数据',
				data: {
					userAllQues,
					total: total[0].total
				}
			})
		}
		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				userAllQues,
				total: total[0].total
			}
		})
	} catch (err) {
		console.log(err)
		res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务器内部错误'
		})
	}
}

//获取用户的标星问卷
exports.getUserStar = async (req, res) => {
	const { userId } = req.query
	const isStar = req.query.isStar === 'true' || req.query.isStar > 0

	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	const userData = await isHaveUser(Number(userId))
	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户不存在'
		})
	}

	if (!isStar) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'isStar 不存在 或为false'
		})
	}

	try {
		const userStarQues = await getUserStarQues(Number(userId), isStar, req.offset, req.pageSize)
		const total = await getQuesTotal(Number(userId), isStar)
		if (userStarQues.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '没有找到标星问卷',
			})
		}

		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				userStarQues,
				total: total[0].total
			}
		})
	} catch (err) {
		console.log(err)
		res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务器内部错误'
		})
	}
}

// 获取用户已删除的问卷
exports.getUserDel = async (req, res) => {
	const { userId } = req.query
	const isDeleted = req.query.isDeleted === 'true' || req.query.isDeleted > 0

	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	const userData = await isHaveUser(Number(userId))
	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户不存在'
		})
	}

	if (!isDeleted) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'isDeleted 不存在 或为false'
		})
	}

	try {
		const userDelQues = await getUserDelQues(Number(userId), isDeleted, req.offset, req.pageSize)
		const total = await getQuesTotal(Number(userId), isStar = false, isDeleted)
		if (userDelQues.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '没有找到被删除的问卷',
			})
		}

		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				userDelQues,
				total: total[0].total
			}
		})
	} catch (err) {
		console.log(err)
		res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务器内部错误'
		})
	}
}

// 假删除某个问卷
exports.hiddenQues = async (req, res) => {
	const { userId, quesId } = req.query
	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	const userData = await isHaveUser(Number(userId))
	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户不存在'
		})
	}

	if (!quesId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'quesId 不能为空'
		})
	}

	try {
		const quesData = await isHaveQues(Number(quesId))
		if (quesData.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '该问卷不存在'
			})
		}

		await hidQuse(Number(userId), Number(quesId))
		return res.status(OK).send({
			code: OK,
			msg: ''
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}

}

// 标星与取消标星
exports.setStarStatus = async (req, res) => {
	const { userId, quesId } = req.body
	const isStar = req.body.isStar === 'true' || req.body.isStar > 0
	if (!userId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'userId 不能为空'
		})
	}

	const userData = await isHaveUser(Number(userId))
	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户不存在'
		})
	}

	if (!quesId) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: 'quesId 不能为空'
		})
	}

	try {
		const quesData = await isHaveQues(Number(quesId))
		if (quesData.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '该问卷不存在'
			})
		}
		await setStarStatusModel(Number(userId), Number(quesId), isStar)
		return res.status(OK).send({
			code: OK,
			msg: ''
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}
}

// 恢复问卷
exports.recoverQues = async (req, res) => {
	const quesId = req.params.id
	try {
		const quesData = await isHaveQues(Number(quesId))
		if (quesData.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '该问卷不存在'
			})
		}
		await recoverQuesModel(Number(quesId))
		return res.status(OK).send({
			code: OK,
			msg: ''
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}
}

// 彻底删除问卷（从回收站中删除）
exports.delQues = async (req, res) => {
	const { ids } = req.body
	try {
		for await (const quesId of ids) {
			await delQuesModel(Number(quesId))
		}
		return res.status(OK).send({
			code: OK,
			msg: ''
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}
}

// 搜索问卷
exports.searchQues = async (req, res) => {
	const { userId, keyword, isPublished } = req.query

	const isStar = req.query.isStar === 'true' || req.body.query > 0
	const isDeleted = req.query.isDeleted === 'true' || req.body.query > 0
	try {
		let quesData = await searchQuesModel(Number(userId), keyword, isStar, isDeleted, isPublished, req.offset, req.pageSize)
		// 如果不是搜索回收站则过滤掉在回收站中的问卷
		let total = await getSearchQuesTotal(Number(userId), isStar, isDeleted, isPublished, keyword)

		if (!isDeleted) {
			quesData = quesData.filter(item => item.isDeleted == 0)
		}
		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				quesData,
				total: total[0].total
			}
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}
}

// 排序
exports.sortQues = async (req, res) => {
	let { userId, sort, order, isPublished, keyword } = req.query

	if (sort !== 'createdAt' || sort !== 'updatedAt') sort = 'createdAt'
	if (order !== 'desc' || order !== 'asc') order = 'desc'

	try {
		const quesData = await sortQuesModel(Number(userId), sort, order, req.offset, req.pageSize, isPublished, keyword)
		// 获取问卷的未删除的数量
		let total
		if (keyword) {
			if (isPublished === 'true') {
				total = await getPublishedQuesTotal(Number(userId), isStar = false, isPublished = true, keyword)
			} else if (isPublished === 'false') {
				total = await getPublishedQuesTotal(Number(userId), isStar = false, isPublished = false, keyword)
			} else {
				total = await getSearchQuesTotal(Number(userId), isStar = false, isDeleted = false, isPublished, keyword)
			}
		} else {
			if (isPublished === 'true') {
				total = await getPublishedQuesTotal(Number(userId), isStar = false, isPublished = true, keyword)
			} else if (isPublished === 'false') {
				total = await getPublishedQuesTotal(Number(userId), isStar = false, isPublished = false, keyword)
			} else {
				total = await getQuesTotal(Number(userId))
			}
		}
		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				quesData,
				total: total[0].total
			}
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务端内部错误'
		})
	}

}

// 更新问卷信息
exports.updateQues = async (req, res) => {
	const quesId = req.params.id
	const quesInfo = await getQuesInfoModel(quesId)
	// 辅助函数，用于如果前端没传值，然后值是undefined，解构会报错，而且应该是没传值就用默认的数据表里面的值
	function safeDestructure(obj, keys) {
		return keys.reduce((result, key) => {
			const value = obj[key]
			if (value === undefined) {
				result[key] = quesInfo[0][key]
			} else {
				result[key] = value
			}
			return result
		}, {});
	}

	const { title, isStar, isPublished, isDeleted, isShowOrderIndex, description, updatedAt }
		= safeDestructure(req.body, ['title', 'isStar', 'isPublished', 'isDeleted', 'isShowOrderIndex', 'description', 'updatedAt']);
	const { componentList } = req.body

	componentList && componentList.forEach(async item => {
		const isHaveCom = await getSingleCom(item.id)
		// 组件表中有该组件则更新没有则插入
		if (isHaveCom.length > 0) {
			await updateComponentModel(item.id, item.title, item.order_index)
			if (item.props) {
				Object.entries(item.props).forEach(async prop => {
					const propsRes = await getSingleComProp({
						property_key: prop[0],
						comId: item.id
					})

					// 如果不是复杂类型
					if (typeof prop[1] !== 'object') {
						// 如果存在属性则更新
						if (propsRes.length > 0) {
							await updateComponentPropModel({ comId: item.id, property_key: prop[0], property_value: prop[1] })
						} else {
							await addComPropInfo({ comId: item.id, property_key: prop[0], property_value: prop[1], option_mode: null, is_complex: 0 })
						}
					} else {
						// 是复杂类型判断是那个
						switch (item.type) {
							case 'questionRadio':
								const radioRes = await getSingleComProp({
									property_key: 'radio',
									comId: item.id
								})
								radioRes.length <= 0 && await addComPropInfo({ comId: item.id, property_key: 'radio', property_value: '', option_mode: 'single', is_complex: 1 })
								// 单选，要更新选项表
								radioRes.length > 0 && prop[1].forEach(async option => {
									// 如果是传过来的选项没有值就过滤掉
									if (option.text == '') return
									// 获取选项表中的单个选项
									const optionRes = await getComplexPropOption({ propId: radioRes[0].id, value: option.value })
									// 如果选项表中有该选项就更新text
									if (optionRes.length > 0) {
										await updateComplexPropOption({ propId: radioRes[0].id, value: option.value, text: option.text, checked: option.value === item.props.value ? true : '' })
									} else {
										// 没有就新增
										await addOptionItem({ propId: radioRes[0].id, value: option.value, text: option.text, checked: option.value === item.props.value ? true : '' })
									}
								})
								// 获取选项表中的某个属性的所有选项
								const optionResList = radioRes.length > 0 && await getComplexPropOption({ propId: radioRes[0].id })
								// 要删除的选项
								const delOption = optionResList && optionResList.filter(optModel => !prop[1].find(optItem => optItem.value === optModel.value))
								delOption && delOption.forEach(async delOpt => await delOptionModel({ propId: delOpt.component_property_id, value: delOpt.value }))
								break
							case 'questionCheckbox':
								const checkboxRes = await getSingleComProp({
									property_key: 'checkbox',
									comId: item.id
								})
								checkboxRes.length <= 0 && await addComPropInfo({ comId: item.id, property_key: 'checkbox', property_value: '', option_mode: 'multiple', is_complex: 1 })
								// 多选，要更新选项表
								checkboxRes.length > 0 && prop[1].forEach(async option => {
									// 如果是传过来的选项没有值就过滤掉
									if (option.text == '') return
									const optionRes = await getComplexPropOption({ propId: checkboxRes[0].id, value: option.value })
									// 如果选项表中有该选项就更新text
									if (optionRes.length > 0) {
										await updateComplexPropOption({ propId: checkboxRes[0].id, value: option.value, text: option.text, checked: option.checked || '' })
									} else {
										// 没有就新增
										await addOptionItem({ propId: checkboxRes[0].id, value: option.value, text: option.text, checked: option.checked || '' })
									}
								})
								// 获取选项表中的某个属性的所有选项
								const optionResList1 = checkboxRes.length > 0 && await getComplexPropOption({ propId: checkboxRes[0].id })
								// 要删除的选项
								const delOption1 = optionResList1 && optionResList1.filter(optModel => !prop[1].find(optItem => optItem.value === optModel.value))
								delOption1 && delOption1.forEach(async delOpt => await delOptionModel({ propId: delOpt.component_property_id, value: delOpt.value }))
								break
						}

					}
				})
			}
		} else {
			// 先根据类型获取系统组件的id
			const systemRes = await getSingleSystemCom(item.type)
			// 增加组件信息
			await addComInfo({
				id: item.id,
				surver_id: quesId,
				component_id: systemRes[0].systemComId,
				title: item.title,
				order_index: item.order_index
			})

			if (item.type === 'questionRadio') {
				const addComPropInfoRes = await addComPropInfo({ comId: item.id, property_key: 'radio', property_value: '', option_mode: 'single', is_complex: 1 })
				for (const optItem of item.props.options) {
					await addOptionItem({ propId: addComPropInfoRes.insertId, value: optItem.value, text: optItem.text, checked: optItem.value === item.props.value ? true : '' });
				}
			}
			if (item.type === 'questionCheckbox') {
				const addComPropInfoRes = await addComPropInfo({ comId: item.id, property_key: 'checkbox', property_value: '', option_mode: 'multiple', is_complex: 1 })
				for (const optItem of item.props.list) {
					await addOptionItem({ propId: addComPropInfoRes.insertId, value: optItem.value, text: optItem.text, checked: optItem.checked || '' });
				}
			}
		}
	})

	// 获取该问卷的所有组件（问题） (为删除做准备)
	const quesComRes = await getQuestionComponents(quesId)
	// 在数据表中但是不在传过来的那个组件列表中的就是要删除的组件，因为在上面已经执行了添加组件
	const delComs = componentList ? quesComRes.filter(quesCom => !componentList.find(com => quesCom.id === com.id)) : []
	delComs && delComs.forEach(async delCom => await delComModel(delCom.id))



	await updateQuestionModel(quesId, title, isStar, isPublished, isDeleted, description, isShowOrderIndex, updatedAt)
	return res.status(OK).send({
		code: OK,
		msg: '更新问卷成功',
		data: {}
	})
}

// 复制问卷
exports.copyQues = async (req, res) => {
	const id = req.params.id
	const { title } = req.body
	const result = await copyQuestionModel(id, title)
	return res.status(OK).send({
		code: OK,
		msg: '复制问卷成功',
		data: {
			id: result.insertId
		}
	})
}

//获取某个问卷的详细信息
exports.getQuesInfo = async (req, res) => {
	const quesId = req.params.id
	const quesInfo = await getQuesInfoModel(quesId)
	const components = await getQuestionComponents(quesId)

	const componentList = []
	let currentComponent;
	let complexProp;
	for (const row of components) {
		if (row.is_complex) {
			// 如果是复制类型则去复杂类型表中查询复杂类型的属性
			const comPlexPropRes = await getComponentComplexPropModel(row.prop_id)

			complexProp = [
				...comPlexPropRes
			]
		}


		if (!currentComponent || currentComponent.id !== row.id) {
			// 新的组件实例开始
			currentComponent = {
				id: row.id,
				title: row.title,
				order_index: row.order_index,
				type: row.type,
				props: {
					value: ''
				},
			};
			componentList.push(currentComponent)
		}
		// 添加或更新当前组件实例的props row.property_key === 'value' 是因为单选默认选中保存的property_key是value， 如果置为空得返回给其阿奴但false
		if (row.property_key || row.property_key == 'value') {
			if (row.property_value == 'true' || row.property_value == 1) {
				currentComponent.props[row.property_key] = true
			} else if (row.property_value == 'false' || row.property_value == 0) {
				currentComponent.props[row.property_key] = false
			} else {
				currentComponent.props[row.property_key] = row.property_value
			}
		}

		// 如果是单选或者多选把complexProp赋值给currentComponent.props.
		if (row.option_mode === 'single') {
			currentComponent.props.options = complexProp
		} else if (row.option_mode === 'multiple') {
			currentComponent.props.list = complexProp
		}

	}

	let result = {
		...quesInfo[0],
		componentList
	}

	res.status(OK).send({
		code: OK,
		msg: quesId,
		data: result
	})
}