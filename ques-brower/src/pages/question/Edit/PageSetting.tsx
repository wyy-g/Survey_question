import React, { FC, useEffect, useState } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { resetPageInfo } from '../../../store/pageInfoReducer'
import { multiLangOptions, LanguageOption } from '../../../utools/const'

const PageSetting: FC = () => {
	const pageInfo = useGetPageInfo()
	const {
		isPublished,
		createdAt,
		updatedAt,
		isMultiLang,
		lang: innerLang,
		defaultLang: innerDefaultLang,
	} = pageInfo
	const [form] = Form.useForm()

	const dispatch = useDispatch()

	function handleValueChange() {
		const { defaultLang, lang } = form.getFieldsValue()
		dispatch(
			resetPageInfo({
				...form.getFieldsValue(),
				isPublished,
				createdAt,
				updatedAt,
				defaultLang: defaultLang ? defaultLang : innerDefaultLang,
				lang: lang ? lang : innerLang,
			}),
		)
	}

	// 可切换的语言
	const [filterLang, setFilterLang] = useState<LanguageOption[]>([])
	useEffect(() => {
		const selectLang = multiLangOptions.filter(item => innerLang?.includes(item.value))
		setFilterLang(selectLang)
	}, [innerLang])

	useEffect(() => {
		form.setFieldsValue(pageInfo)
	}, [pageInfo])

	return (
		<Form
			layout="horizontal"
			initialValues={pageInfo}
			onValuesChange={handleValueChange}
			form={form}
			labelCol={{ span: '8' }}
			wrapperCol={{ span: '16' }}
		>
			<Form.Item
				label="问卷标题"
				name="title"
				rules={[{ required: true, message: '问卷标题不能为空' }]}
			>
				<Input placeholder="请输入标题" />
			</Form.Item>
			<Form.Item label="问卷描述" name="description">
				<Input.TextArea
					placeholder="请输入问卷描述"
					maxLength={200}
					style={{ height: 100, width: '180px' }}
					showCount
				></Input.TextArea>
			</Form.Item>
			<Form.Item label="显示题目序号" name="isShowOrderIndex">
				<Switch />
			</Form.Item>
			<Form.Item
				label="开启反馈"
				name="isEnableFeedback"
				tooltip="开启反馈后用户提交完可以填写对此文件的建议，你可以实时接受到此建议"
			>
				<Switch />
			</Form.Item>
			<Form.Item
				label="多语言"
				name="isMultiLang"
				tooltip="开启多语言后可以设置语言格式，在答卷时用户可以选择语言"
			>
				<Switch />
			</Form.Item>
			{isMultiLang ? (
				<>
					<Form.Item label="默认展示语言" name="defaultLang">
						<Select
							style={{ width: '100%' }}
							defaultValue={innerDefaultLang || 'zh'}
							options={filterLang}
							placeholder="请选择语言"
						/>
					</Form.Item>
					<Form.Item
						name="lang"
						label="可切换语言"
						wrapperCol={{ span: 24 }}
						rules={[{ required: true, message: '请至少选择一种语言!' }]}
					>
						<Select
							mode="multiple"
							style={{ width: '100%' }}
							options={multiLangOptions}
							placeholder="请选择语言"
						/>
					</Form.Item>
				</>
			) : (
				''
			)}
		</Form>
	)
}

export default PageSetting
