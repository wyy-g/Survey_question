import React, { FC, useRef, useEffect } from 'react'
import { Bar } from '@ant-design/plots'

type chartDataItemType = {
	key: number
	answer: string
	count: number
}

type BarChartProps = {
	chartData: Array<chartDataItemType>
	onChartReady?: (chartInstance: any) => void // 添加onChartReady回调属性
}

const BarChart: FC<BarChartProps> = (props: BarChartProps) => {
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
		height: 150 + (chartData.length - 3) * 50,
		width: 390,
		data: chartData,
		xField: 'count',
		yField: 'answer',
		seriesField: 'answer',
		theme: {
			backgroundColor: '#fff', // 设置背景色
		},
		// padding: [20, 20, 20, 20],
		label: {
			layout: ['vertical'],
			position: 'right',
			formatter: (datum: any) => {
				const percentage = (datum?.count / totalCount) * 100 || 0
				if (!percentage) return
				return `${percentage.toFixed(2)}%`
			}, // 计算百分比
			style: {
				fontSize: 12,
			},
		},
		legend: {
			position: 'right',
			padding: [40, 40, 40, 90],
		},
		color: ['#ffc076', '#95a2ff', '#fa8080', '#fae768', '#87e885', '#3cb9fc', '#73abf5'],
		meta: {
			answer: {
				alias: '计数',
			},
		},
		minBarWidth: 20,
		maxBarWidth: 20,
	}

	return (
		/* eslint-disable */
		// @ts-ignore
		<Bar
			{...config}
			onReady={plot => {
				chartInstance.current = plot
			}}
		/>
	)
}

export default BarChart
