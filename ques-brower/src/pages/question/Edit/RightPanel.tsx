import React, { FC } from 'react'
import { Tabs } from 'antd'
import { FileOutlined, SettingOutlined } from '@ant-design/icons'
import ComponentProp from './ComponentProp'

const RightPanel: FC = () => {
	const tabsItems = [
		{
			key: 'prop',
			label: (
				<span style={{ marginLeft: '15px' }}>
					<FileOutlined />
					<span style={{ marginLeft: '-7px' }}>属性设置</span>
				</span>
			),
			children: <ComponentProp />,
		},
		{
			key: 'setting',
			label: (
				<span style={{ marginLeft: '15px' }}>
					<SettingOutlined />
					<span style={{ marginLeft: '-7px' }}>整卷设置</span>
				</span>
			),
			children: <div>整卷设置</div>,
		},
	]
	return <Tabs defaultActiveKey="setting" items={tabsItems}></Tabs>
}

export default RightPanel
