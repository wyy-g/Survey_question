import React, { FC } from 'react'
import { Tabs } from 'antd'
import { AppstoreAddOutlined, BarsOutlined } from '@ant-design/icons'
import ComponentLib from './ComponentLib'

const LeftPanel: FC = () => {
	const tableColumns = [
		{
			key: 'componentLib',
			label: (
				<span style={{ marginLeft: '15px' }}>
					<AppstoreAddOutlined />
					<span style={{ marginLeft: '-7px' }}>组件库</span>
				</span>
			),
			children: <ComponentLib />,
		},
		{
			key: 'layers',
			label: (
				<span>
					<BarsOutlined />
					<span style={{ marginLeft: '-7px' }}>大纲</span>
				</span>
			),
			children: <div>大纲</div>,
		},
	]
	return <Tabs items={tableColumns} defaultActiveKey="componentLib"></Tabs>
}

export default LeftPanel
