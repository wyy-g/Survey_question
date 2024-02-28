import React, { FC, useRef, useEffect } from 'react'
import { Pie } from '@ant-design/plots'

type chartDataItemType = {
	key: number
	answer: string
	count: number
}

type PieChartProps = {
	chartData: Array<chartDataItemType>
	onChartReady?: (chartInstance: any) => void // 添加onChartReady回调属性
}

const PieChart: FC<PieChartProps> = (props: PieChartProps) => {
	const { chartData, onChartReady } = props
	const filteredData = chartData.filter(item => item.count !== 0)
	const chartInstance = useRef<any>()

	useEffect(() => {
		if (onChartReady) {
			onChartReady(chartInstance)
		}
	})

	const config = {
		width: 300,
		height: 300,
		appendPadding: 10,
		data: filteredData,
		angleField: 'count',
		colorField: 'answer',
		radius: 0.9,
		color: ['#ffc076', '#95a2ff', '#fa8080', '#fae768', '#87e885', '#3cb9fc', '#73abf5'],
		label: {
			type: 'inner',
			offset: '-40%',
			/* eslint-disable */
			// @ts-ignore
			content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
			style: {
				fontSize: 14,
				textAlign: 'center',
			},
		},
		interactions: [
			{
				type: 'element-active',
			},
		],
	}

	return (
		/* eslint-disable */
		// @ts-ignore
		<Pie
			{...config}
			onReady={plot => {
				chartInstance.current = plot
			}}
		/>
	)
}

export default PieChart
