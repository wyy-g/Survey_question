import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, InputNumber, Radio } from 'antd'
import { QuestionMarkPropsType, QuestionMarkDefaultProps, QuestionMarkIcon } from './interface'
import IconFont from '../../../utools/IconFont'

const PropComponent: FC<QuestionMarkPropsType> = (props: QuestionMarkPropsType) => {
	const QuestionMarkIcon: QuestionMarkIcon[] = [
		'icon-star',
		'icon-shouye',
		'icon-haopingxiaolian',
		'icon-zantong',
		'icon-aixin',
	]
	const {
		title,
		isShowTitle,
		isMustFill,
		customErrorMessage,
		maxCount,
		allowHalf,
		customIcon,
		onChange,
		isShow,
	} = {
		...QuestionMarkDefaultProps,
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
			allowHalf,
			isShow,
			isShowTitle,
			isMustFill,
			maxCount,
			customErrorMessage,
			customIcon,
		})
	}, [title, isShow, isShowTitle, isMustFill, customErrorMessage, allowHalf, maxCount, customIcon])

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				isShow,
				isShowTitle,
				isMustFill,
				customErrorMessage,
				allowHalf,
				maxCount,
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
			<Form.Item label="最大分值" name="maxCount">
				<InputNumber min={5} max={10} />
			</Form.Item>
			<Form.Item label="允许半分" name="allowHalf">
				<Switch />
			</Form.Item>
			<Form.Item label="图标" name="customIcon">
				<Radio.Group defaultValue={customIcon} size="small">
					{QuestionMarkIcon.map((item, index) => {
						return (
							<Radio.Button value={item} key={item + index}>
								<IconFont type={item} />
							</Radio.Button>
						)
					})}
				</Radio.Group>
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
			<Form.Item
				label="隐藏组件"
				name="isShow"
				tooltip="开启此属性，则组件发布后不会显示，可作为备注使用"
			>
				<Switch />
			</Form.Item>
		</Form>
	)
}

export default PropComponent
