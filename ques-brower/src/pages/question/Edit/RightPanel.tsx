import React, { FC, useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { FileOutlined, SettingOutlined } from '@ant-design/icons'
import ComponentProp from './ComponentProp'
import PageSetting from './PageSetting'
import styles from './RightPanel.module.scss'
// import useGetComponentStore from '../../../hooks/useGetComponentStore'

const RightPanel: FC = () => {
	// const { selectId } = useGetComponentStore()
	// const [activeKey, setActivekey] = useState('setting')

	// useEffect(() => {
	// 	if (selectId) setActivekey('prop')
	// 	else setActivekey('setting')
	// }, [selectId])

	const tabsItems = [
		{
			key: 'prop',
			label: (
				<span style={{ marginLeft: '15px' }}>
					<FileOutlined />
					<span style={{ marginLeft: '-7px' }}>属性设置</span>
				</span>
			),
			children: (
				<div className={styles['component-props']}>
					<ComponentProp />
				</div>
			),
		},
		{
			key: 'setting',
			label: (
				<span style={{ marginLeft: '15px' }}>
					<SettingOutlined />
					<span style={{ marginLeft: '-7px' }}>整卷设置</span>
				</span>
			),
			children: <PageSetting />,
		},
	]
	// return <Tabs activeKey={activeKey} items={tabsItems}></Tabs>
	return <Tabs defaultActiveKey="setting" items={tabsItems}></Tabs>
}

export default RightPanel
