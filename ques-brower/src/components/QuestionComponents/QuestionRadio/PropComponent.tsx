import React, { FC, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { Form, Input, Switch, Checkbox, Select, Button, Space, Divider } from 'antd'
import { QuestionRadioPropsType, QuestionRadioDefaultProps, OptionType } from './interface'
import IconFont from '../../../utools/IconFont'
import { MinusCircleOutlined } from '@ant-design/icons'

const PropComponent: FC<QuestionRadioPropsType> = (props: QuestionRadioPropsType) => {
	const {
		title,
		isVertical,
		options,
		isShowTitle,
		isMustFill,
		isShow,
		value,
		onChange,
		customErrorMessage,
	} = {
		...QuestionRadioDefaultProps,
		...props,
	}
	const [form] = Form.useForm()

	useEffect(() => {
		form.setFieldsValue({
			title,
			isVertical,
			options,
			isShowTitle,
			isMustFill,
			isShow,
			value,
			customErrorMessage,
		})
	}, [title, isVertical, options, isShowTitle, isMustFill, isShow, value, customErrorMessage])

	function handleValueChange() {
		if (onChange) {
			const newFields = form.getFieldsValue() as QuestionRadioPropsType
			if (newFields.options) {
				newFields.options = newFields.options.filter(opt => !(opt.text == null))
			}
			const { options = [] } = newFields
			options.forEach(opt => {
				if (opt.value) return
				opt.value = nanoid(5) //补齐opt.value
			})
			onChange(newFields)
		}
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{
				title,
				isVertical,
				options,
				isShowTitle,
				isMustFill,
				isShow,
				value,
				customErrorMessage,
			}}
			onValuesChange={handleValueChange}
			form={form}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
				<Input />
			</Form.Item>
			<Form.Item label="显示标题" name="isShowTitle">
				<Switch />
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
			<Form.Item label="默认选中" name="value">
				<Select
					value={value}
					options={options?.map(({ text, value }) => ({ value, label: text || '' }))}
					allowClear
				></Select>
			</Form.Item>
			<Form.Item label="竖向排列" name="isVertical" valuePropName="checked">
				<Checkbox />
			</Form.Item>
			<Divider>选项</Divider>
			<Form.Item wrapperCol={{ span: 24 }} style={{ marginLeft: '30px' }}>
				<Form.List name="options">
					{(fields, { add, remove }) => (
						<>
							{/* 遍历所有得选项， 可以删除 */}
							{fields.map(({ key, name }, index) => {
								return (
									<Space key={key} align="baseline">
										{/* 输入框 */}
										<Form.Item
											name={[name, 'text']}
											rules={[
												{ required: true, message: '请输入选项文字' },
												{
													validator: (_, text) => {
														const { options = [] } = form.getFieldsValue()
														let num = 0
														options.forEach((opt: OptionType) => {
															if (opt.text === text) num++ //记录text相同的个数，预期只有一个，就是他自己
														})
														if (num === 1) return Promise.resolve()
														return Promise.reject(new Error('和其他选项重复了'))
													},
												},
											]}
											style={{ width: '200px' }}
										>
											<Input placeholder="请输入选项文字"></Input>
										</Form.Item>
										{/* 当前选项删除按钮 */}
										{index > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
									</Space>
								)
							})}
							{/* 添加 */}
							<Form.Item>
								<Button
									type="link"
									icon={<IconFont type="icon-plus-border" />}
									onClick={() => add({ text: '', value: '' })}
								>
									添加选项
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form.Item>
		</Form>
	)
}

export default PropComponent
