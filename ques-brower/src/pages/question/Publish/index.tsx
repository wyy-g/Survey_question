import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
import dayjs from 'dayjs'
/* eslint-enable */
import { Typography, Switch, Divider, Button, Space, message, DatePicker } from 'antd'
import { useDispatch } from 'react-redux'
import QRCode from 'qrcode.react'
import { useRequest } from 'ahooks'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import styles from './index.module.scss'
import { changePageIsPushlished } from '../../../store/pageInfoReducer'
import { updateQuesService } from '../../../services/question'
import useGetComponentStore from '../../../hooks/useGetComponentStore'

const { Title } = Typography
const { RangePicker } = DatePicker

const Publish: FC = () => {
	const { id = '' } = useParams()
	useLoadQuestionData()
	const {
		createdAt,
		updatedAt,
		isPublished,
		title,
		isShowOrderIndex,
		description,
		startTime,
		endTime,
	} = useGetPageInfo()
	const { componentList = [] } = useGetComponentStore()

	const dispatch = useDispatch()
	const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
	const formateStartTime = startTime
		? moment.utc(startTime).local().format('YYYY-MM-DD HH:mm:ss')
		: currentTime
	const formateEndTime = endTime
		? moment.utc(endTime).local().format('YYYY-MM-DD HH:mm:ss')
		: moment().clone().add(15, 'days').format('YYYY-MM-DD HH:mm:ss')

	const dateFormat = 'YYYY-MM-DD HH:mm:ss'

	const { run: publish } = useRequest(
		async (status: boolean, startTime?: string, endTime?: string) => {
			const validStartTime = startTime ? startTime : formateStartTime
			const validEndTime = endTime ? endTime : formateEndTime
			const params = {
				title,
				isShowOrderIndex,
				description,
				componentList,
				isPublished: status,
				updatedAt: currentTime,
				startTime: validStartTime,
				endTime: validEndTime,
			}

			await updateQuesService(Number(id), params)
		},
		{ manual: true },
	)

	function handleChange(checked: boolean) {
		dispatch(changePageIsPushlished(checked))
		publish(checked, formateStartTime, formateEndTime)
	}

	const apiUrl = process.env.REACT_APP_API_URL!
	const url =
		process.env.NODE_ENV === 'production'
			? apiUrl + `/question/${id}`
			: `http://localhost:3000/question/${id}`

	function copyLink() {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				message.success('复制成功')
			})
			.catch(err => message.error('复制失败'))
	}

	function downQRcode() {
		const oA = document.createElement('a')
		const canvas = document.getElementById('canvas')
		oA.download = `问卷-${title}` // 设置下载的文件名，默认是'下载'
		/* eslint-disable */
		// @ts-ignore
		const canPngUrl = canvas!.toDataURL!('image/png')
		oA.href = canPngUrl
		document.body.appendChild(oA)
		oA.click()
		oA.remove()
	}

	function handleTimeChange(_: any, dateStr: any) {
		publish(isPublished!, dateStr[0], dateStr[1])
	}

	function disablePastDates(current: any) {
		// 禁止选择过去的日期作为结束日期
		return current && current < moment().subtract(1, 'day').endOf('day')
	}

	return (
		<div className={styles.publish}>
			<div className={styles['form-info']}>
				<div className={styles['form-info-time']}>
					<span style={{ marginRight: '100px' }}>
						创建时间： {moment.utc(createdAt).local().format('YYYY-MM-DD HH:mm:ss')}
					</span>
					<span>更新时间： {moment.utc(updatedAt).local().format('YYYY-MM-DD HH:mm:ss')}</span>
				</div>
				<Divider />
				<div className={styles['form-collect']}>
					<Title style={{ fontSize: '20px' }}>表单收集 开始/停止</Title>
					<div style={{ marginTop: '24px', display: 'flex', alignItems: 'center' }}>
						<Switch
							size="small"
							style={{ marginRight: '20px' }}
							checked={isPublished}
							onChange={handleChange}
						/>
						{isPublished ? (
							<span className={styles['publish-prompt']}>已开始，表单正在收集中…</span>
						) : (
							'未发布'
						)}
					</div>
					{isPublished && (
						<div style={{ fontWeight: 'bold', margin: '16px 0', fontSize: '16px' }}>
							设置时间（未设置将自动发布有效期15天）
						</div>
					)}
					{isPublished && (
						<RangePicker
							// 禁止选择过去的结束日期
							disabledDate={disablePastDates}
							format="YYYY-MM-DD HH:mm:ss"
							defaultValue={[
								dayjs(formateStartTime, dateFormat),
								dayjs(formateEndTime, dateFormat),
							]}
							showTime
							onChange={handleTimeChange}
						/>
					)}
				</div>
			</div>
			{isPublished ? (
				<div className={styles['form-link']}>
					<Title style={{ fontSize: '20px' }}>链接分享</Title>
					<div className={styles['link-detail']}>
						<div className={styles['qr-code']}>
							<QRCode value={url} size={120} id="canvas"></QRCode>
						</div>
						<div className={styles['qr-link']}>
							<div className={styles['link-text']}>
								<span className={styles['text-num']}>1</span>
								<span>复制链接</span>
								<span className={styles['divider']}></span>
								<span className={styles['text-num']}>2</span>
								<span>发送链接至用户</span>
							</div>
							<div className={styles['link']}>
								<span style={{ marginRight: '10px' }}>{url}</span>
								<Button type="primary" onClick={copyLink}>
									复制链接
								</Button>
							</div>
							<div>
								<Space>
									<Button
										type="text"
										style={{ background: '#f2f3f9' }}
										onClick={() => window.open(url)}
									>
										直接打开
									</Button>
									<Button type="text" style={{ background: '#f2f3f9' }} onClick={downQRcode}>
										下载二维码
									</Button>
								</Space>
							</div>
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	)
}

export default Publish
