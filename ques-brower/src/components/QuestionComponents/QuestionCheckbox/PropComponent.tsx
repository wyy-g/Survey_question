import React, { FC } from 'react'
import { Form, Input, Checkbox, Divider, Space, Button, Switch } from 'antd'
import { nanoid } from 'nanoid'
import { QuestionCheckboxDefaultProps, QuestionCheckboxPropsType, OptionType } from './interface'
import IconFont from '../../../utools/IconFont'
import { MinusCircleOutlined } from '@ant-design/icons'

const PropComponent: FC<QuestionCheckboxPropsType> = (props: QuestionCheckboxPropsType) => {
	const { title, isVertical, isShowTitle, isMustFill, isShow, list, onChange } = {
		...QuestionCheckboxDefaultProps,
		...props,
	}
	const [form] = Form.useForm()

	function handleValueChange() {
		if (onChange) {
			// onChange
			const newFields = form.getFieldsValue() as QuestionCheckboxPropsType
			if (newFields.list) {
				newFields.list = newFields.list.filter(opt => !(opt.text == null))
			}
			const { list = [] } = newFields
			list.forEach(opt => {
				if (opt.value) return
				opt.value = nanoid(5) //补齐opt.value
			})
			onChange(newFields)
		}
	}

	return (
		<Form
			layout="horizontal"
			initialValues={{ title, isVertical, isShowTitle, isMustFill, isShow, list }}
			form={form}
			onValuesChange={handleValueChange}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
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
			<Form.Item label="竖向排列" name="isVertical" valuePropName="checked">
				<Checkbox />
			</Form.Item>
			<Divider>选项</Divider>
			<Form.Item wrapperCol={{ span: 24 }} style={{ marginLeft: '30px' }}>
				<Form.List name="list">
					{(fields, { add, remove }) => (
						<>
							{/* 遍历所有得选项， 可以删除 */}
							{fields.map(({ key, name }, index) => {
								return (
									<Space key={key} align="baseline">
										{/* 当前选项是否选中 */}
										<Form.Item name={[name, 'checked']} valuePropName="checked">
											<Checkbox></Checkbox>
										</Form.Item>
										{/* 输入框 */}
										<Form.Item
											name={[name, 'text']}
											rules={[
												{ required: true, message: '请输入选项文字' },
												{
													validator: (_, text) => {
														const { list = [] } = form.getFieldsValue()
														let num = 0
														list.forEach((opt: OptionType) => {
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
										{index > 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
									</Space>
								)
							})}
							{/* 添加 */}
							<Form.Item>
								<Button
									type="link"
									icon={<IconFont type="icon-plus-border" />}
									onClick={() => add({ text: '', value: '', checked: false })}
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
