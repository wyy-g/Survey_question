import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { QuestionFilePropsType, QuestionFileDefaultProps } from './interface'

const PropComponent: FC<QuestionFilePropsType> = (props: QuestionFilePropsType) => {
	const {
		title,
		placeholder,
		isClear,
		isShow,
		isShowTitle,
		isMustFill,
		onChange,
		customErrorMessage,
		uploadMaxNum,
		uploadMinNum,
		fileType,
		singleFileSize,
	} = {
		...QuestionFileDefaultProps,
		...props,
	}
	const [form] = Form.useForm()

	function handleValueChange() {
		if (onChange) {
			onChange(form.getFieldsValue())
		}
	}

	useEffect(() => {
		form.setFieldsValue({
			title,
			placeholder,
			isClear,
			isShow,
			isShowTitle,
			isMustFill,
			customErrorMessage,
			singleFileSize,
			fileType,
			uploadMaxNum,
			uploadMinNum,
		})
	}, [
		title,
		placeholder,
		isClear,
		isShow,
		isShowTitle,
		isMustFill,
		customErrorMessage,
		singleFileSize,
		fileType,
		uploadMaxNum,
		uploadMinNum,
	])

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				placeholder,
				isClear,
				isShow,
				isShowTitle,
				isMustFill,
				customErrorMessage,
				singleFileSize,
				fileType,
				uploadMinNum,
				uploadMaxNum,
			}}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="显示标题" name="isShowTitle">
				<Switch />
			</Form.Item>
			<Form.Item label="上传最小数量" name="uploadMinNum" labelCol={{ style: { width: 100 } }}>
				<Select
					defaultValue={true}
					style={{ width: 100 }}
					options={[
						{ value: true, label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
						{ value: '5', label: '5' },
						{ value: '6', label: '6' },
						{ value: '7', label: '7' },
					]}
				/>
			</Form.Item>
			<Form.Item label="上传最大数量" name="uploadMaxNum" labelCol={{ style: { width: 100 } }}>
				<Select
					defaultValue={true}
					style={{ width: 100 }}
					options={[
						{ value: true, label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
						{ value: '5', label: '5' },
						{ value: '6', label: '6' },
						{ value: '7', label: '7' },
					]}
				/>
			</Form.Item>
			<Form.Item label="文件类型" name="fileType">
				<Select
					defaultValue="all"
					style={{ width: 190 }}
					options={[
						{ value: 'all', label: '无限制' },
						{ value: 'documents', label: '文档' },
						{ value: 'images', label: '图片' },
						{ value: 'videos', label: '视频' },
						{ value: 'audio', label: '音频' },
					]}
				/>
			</Form.Item>
			<Form.Item label="文件体积" name="singleFileSize" tooltip="单个文件能上传的最大体积">
				<Select
					defaultValue={true}
					style={{ width: 190 }}
					options={[
						{ value: true, label: '1M（截图、证件照）' },
						{ value: '5', label: '5M（普通照片、文档）' },
						{ value: '10', label: '10M（短视频）' },
						{ value: '20', label: '20M（高清图片、长视频）' },
					]}
				/>
			</Form.Item>
			<Form.Item
				label="隐藏组件"
				name="isShow"
				tooltip="开启此属性，则组件发布后不会显示，可作为备注使用"
			>
				<Switch />
			</Form.Item>
			<Form.Item label="是否必填" name="isMustFill">
				<Switch />
			</Form.Item>
			<Form.Item
				label="错误提示"
				tooltip="填表者在提交不符合校验规则的数据时，会显示此处自定义的文案。"
				name="customErrorMessage"
			>
				<Input />
			</Form.Item>
		</Form>
	)
}

export default PropComponent
