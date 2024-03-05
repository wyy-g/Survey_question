import React, { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
/* eslint-enable */
import { Typography, Switch, Divider, Button, Space, message } from 'antd'
import { useDispatch } from 'react-redux'
import QRCode from 'qrcode.react'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import styles from './index.module.scss'
import { changePageIsPushlished } from '../../../store/pageInfoReducer'

const { Title } = Typography

const Publish: FC = () => {
	const { id = '' } = useParams()
	const { loading } = useLoadQuestionData()
	const { createdAt, updatedAt, isPublished, title } = useGetPageInfo()

	const dispatch = useDispatch()

	const QRcodeRef = useRef(null)

	function handleChange(checked: boolean) {
		dispatch(changePageIsPushlished(checked))
	}

	const apiUrl = process.env.REACT_APP_API_URL!
	const url =
		process.env.NODE_ENV === 'production' ? apiUrl : `http://192.168.1.5:3000/question/${id}`

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
