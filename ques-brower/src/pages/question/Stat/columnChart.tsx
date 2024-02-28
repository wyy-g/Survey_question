import React, { FC, useRef, useEffect } from 'react'
import { Column } from '@ant-design/plots'

type chartDataItemType = {
	key: number
	answer: string
	count: number
}

type ColumnChartProps = {
	chartData: Array<chartDataItemType>
	onChartReady?: (chartInstance: any) => void // 添加onChartReady回调属性
}

const ColumnChart: FC<ColumnChartProps> = (props: ColumnChartProps) => {
	const { chartData, onChartReady } = props
	const chartInstance = useRef<any>()

	useEffect(() => {
		if (onChartReady) {
			onChartReady(chartInstance)
		}
	})

	// 计算总数
	const totalCount = chartData.reduce((total, item) => total + item.count, 0)

	const config = {
		width: 200,
		height: 300,
		data: chartData,
		xField: 'answer',
		yField: 'count',
		color: '#95a2ff',
		label: {
			// 可手动配置 label 数据标签位置
			position: 'middle',
			// 配置样式
			style: {
				fontSize: 12,
				fill: '#fff',
			},
			formatter: (datum: any) => {
				const percentage = (datum?.count / totalCount) * 100 || 0
				if (!percentage) return
				return `${percentage.toFixed(2)}%`
			}, // 计算百分比
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: false,
			},
		},
		meta: {
			count: {
				alias: '计数',
			},
		},
	}

	return (
		/* eslint-disable */
		// @ts-ignore
		<Column
			{...config}
			onReady={plot => {
				chartInstance.current = plot
			}}
		/>
	)
}

export default ColumnChart
