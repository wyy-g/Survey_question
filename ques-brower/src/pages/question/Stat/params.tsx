import React, { FC, useState } from 'react'
import { DatePicker, Radio, Space } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const selectTimeRange = [
	{
		label: '上周',
		value: 'lastWeek',
	},
	{
		label: '本周',
		value: 'thisWeek',
	},
	{
		label: '上月',
		value: 'lastMonth',
	},
	{
		label: '本月',
		value: 'thisMonth',
	},
]

// 日期格式
const format = 'YYYY-MM-DD'

type ParamsPropsType = {
	onTimeParamChange: (timeRange?: string[]) => void
}

const Params: FC<ParamsPropsType> = (props: ParamsPropsType) => {
	const { onTimeParamChange } = props
	const [presetTime, setPresetTime] = useState('') //预设时间
	const [dateRange, setDateRange] = useState<string[]>([]) //日期范围

	function getPresetRangeTime(preset: string) {
		let startTime
		let endTime
		switch (preset) {
			case 'lastWeek':
				startTime = dayjs().subtract(1, 'week').startOf('week')
				endTime = dayjs().subtract(1, 'week').endOf('week')
				break
			case 'thisWeek':
				startTime = dayjs().startOf('week')
				endTime = dayjs().endOf('week')
				break
			case 'lastMonth':
				startTime = dayjs().subtract(1, 'month').startOf('month')
				endTime = dayjs().subtract(1, 'month').endOf('month')
				break
			case 'thisMonth':
				startTime = dayjs().startOf('month')
				endTime = dayjs().endOf('month')
				break
			default:
				throw new Error(`Unsupported preset: ${preset}`)
		}
		return [startTime.format(format), endTime.format(format)]
	}

	function handlePresetTimeChange(e: any) {
		const selectedPreset = e.target.value
		const newPressetRange = getPresetRangeTime(selectedPreset)
		setDateRange(newPressetRange)
		onTimeParamChange(newPressetRange)
		setPresetTime(selectedPreset)
	}

	// 时间改变
	function handleTimeChange(dates: any) {
		if (dates && dates.length !== 0) {
			const [startStr, endStr] = dates.map((date: any) => date.format(format))
			setDateRange([startStr, endStr])
			onTimeParamChange([startStr, endStr])
		}

		if (!dates) {
			setDateRange([])
		}

		onTimeParamChange()
		setPresetTime('') // 用户手动更改日期时清除预设时间段
	}

	return (
		<Space>
			{dateRange.length > 0 ? (
				<RangePicker
					value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
					onChange={handleTimeChange}
				/>
			) : (
				<RangePicker onChange={handleTimeChange} />
			)}
			<Radio.Group value={presetTime} onChange={handlePresetTimeChange}>
				{selectTimeRange.map((item, index) => {
					return (
						<Radio.Button value={item.value} key={item.value + index}>
							<span>{item.label}</span>
						</Radio.Button>
					)
				})}
			</Radio.Group>
		</Space>
	)
}

export default Params
