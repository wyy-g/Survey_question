import React, { FC, useState, useEffect } from 'react'
import { Empty, Button, Spin, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
/* eslint-disable */
// @ts-ignore
import moment from 'moment'
/* eslint-disable */
// @ts-ignore
import UAParser from 'ua-parser-js'
/* eslint-enable */
import { useRequest } from 'ahooks'
import axios from 'axios'
import QRCode from 'qrcode.react'
import emptyImg from '../../assets/no_publish.png'
import { getQuesInfoService } from '../../services/question'
import { submitAnswers } from '../../services/answer'
import styles from './index.module.scss'
import { ComponentInfoType } from '../../store/componentReducer'
import { getComponentConfByType } from '../../components/QuestionComponents'

const AnswerQues: FC = () => {
	const nav = useNavigate()
	const { id = '' } = useParams()

	const [isSubmit, setIsSubmit] = useState(false)
	// 提交问卷的loading防止多次提交
	const [submitLoading, setSubmitLoading] = useState(false)

	const [isPublished, setIsPublished] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [componentList = [], setComponentList] = useState([])
	const [startTime, setStartTime] = useState<string>('')
	const [submitLocationInfo, setSubmitLocationInfo] = useState<{ [key: string]: string }>({})
	const [device_info, setDevice_info] = useState('')
	const [browser_info, setBrowser_info] = useState('')
	const [writeAnswer, setWriteAnswer] = useState<{ [key: string]: string | number }[]>([])

	const apiUrl = process.env.REACT_APP_API_URL!
	const url =
		process.env.NODE_ENV === 'production'
			? apiUrl + `/question/${id}`
			: `http://localhost:3000/question/${id}`

	const { loading } = useRequest(
		async () => {
			if (!id) return
			const data = await getQuesInfoService(Number(id))
			return data
		},
		{
			onSuccess: data => {
				setIsPublished(data!.isPublished)
				setComponentList(data!.componentList)
				setTitle(data!.title)
				setDescription(data!.description)
			},
		},
	)

	useRequest(
		async () => {
			const data = await getUserLocation()
			return data
		},
		{
			onSuccess: data => {
				setSubmitLocationInfo({ ip: data!.ip, version: data!.version, city: data!.city })
			},
		},
	)

	// const writeAnswer: any = []

	const [rootFontSize, setRootFontSize] = useState(16) // 基于初始设计稿的基础字号

	useEffect(() => {
		const now = moment().format('YYYY-MM-DD HH:mm:ss')
		setStartTime(now)

		// 获取设别信息
		const userAgent = navigator.userAgent
		const { device_info, browser_info } = getDeviceInfoAndBrowserInfo(userAgent)
		setDevice_info(device_info)
		setBrowser_info(browser_info)

		const handleResize = () => {
			const baseFontSize = 50 // 基准字体大小（例如：设计稿中的参考字体大小）
			const targetWidth = 750 // 设计稿的目标宽度
			const deviceWidth = window.innerWidth || document.documentElement.clientWidth

			// 计算实际设备宽度下的字体大小
			const fontSize = Math.min(deviceWidth / (targetWidth / baseFontSize), 100)

			setRootFontSize(fontSize)
			document.documentElement.style.fontSize = `${fontSize}px`
		}

		// 当组件挂载时执行一次，并添加窗口大小改变的监听器
		handleResize()
		window.addEventListener('resize', handleResize)

		// 组件卸载时移除窗口大小改变的监听器，避免内存泄漏
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	console.log('rootFontSize', rootFontSize)

	// 获取设备信息
	function getDeviceInfoAndBrowserInfo(userAgent: any) {
		const parser = new UAParser(userAgent)
		const result = parser.getResult()

		return {
			device_info:
				result.device.type === undefined ? 'PC' : `${result.device.type},${result.device.model}`,
			browser_info: `${result.browser.name},${result.engine.name}`,
		}
	}

	// 获取ip地址
	async function getUserLocation() {
		try {
			const response = await axios.get('https://ipapi.co/json/')
			return response.data
		} catch (error) {
			console.error('Failed to get user location', error)
			return null
		}
	}

	function handleValueChange(
		answer_value: string,
		component_instance_id: string | number,
		question_type: string,
	) {
		// 查找已有记录
		setWriteAnswer(prevWriteAnswer => {
			const existingAnswer = prevWriteAnswer.find(
				answer => answer.component_instance_id === component_instance_id,
			)

			return [
				...(existingAnswer
					? prevWriteAnswer.map(answer =>
							answer.component_instance_id === component_instance_id
								? { ...answer, answer_value }
								: answer,
						)
					: prevWriteAnswer),
				...(existingAnswer ? [] : [{ component_instance_id, question_type, answer_value }]),
			]
		})
	}

	function genComponent(componentInfo: ComponentInfoType) {
		const { type, props, title, order_index, id } = componentInfo
		const componentConf = getComponentConfByType(type)
		if (!componentConf) return
		const { Component } = componentConf
		const newProps = {
			...props,
			title,
			order_index,
		}
		return <Component {...newProps} onValueChange={value => handleValueChange(value, id, type)} />
	}

	async function submitAnswer() {
		// 获取设别信息
		setSubmitLoading(true)
		const data = await submitAnswers({
			survey_id: Number(id),
			device_info,
			browser_info,
			ip_address: submitLocationInfo.ip
				? `${submitLocationInfo.ip}(${submitLocationInfo.version})`
				: '',
			startTime,
			writeAnswer,
		})
		if (data.submission_id) {
			setIsSubmit(true)
			setSubmitLoading(false)
			message.success('提交答案成功')
		} else {
			message.error('提交失败，请稍后再试')
		}
	}

	return (
		<div className={device_info == 'PC' ? styles['answers-wrapper-pc'] : styles['answers-wrapper']}>
			{loading ? (
				<div className={styles['loading-wrapper']}>
					<Spin size="large" tip="loading....">
						{' '}
						{/* 占位 */}
						<div className="content" />
					</Spin>
				</div>
			) : (
				<div className={device_info == 'PC' ? styles['pc-wrapper'] : ''}>
					{!isPublished && !isSubmit ? (
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Empty
								image={emptyImg}
								style={{ height: '200px', marginTop: '200px' }}
								description="抱歉！你访问的表单已停止收集数据"
							>
								<Button type="primary" onClick={() => nav('/')}>
									去使用
								</Button>
							</Empty>
						</div>
					) : (
						''
					)}
					{isPublished && !isSubmit ? (
						<>
							<div className={styles['answer-ques-wrapper']}>
								<div className={styles['header']}>
									<div className={styles['title']}>{title}</div>
									<div className={styles['desc']}>{description}</div>
								</div>
								{componentList.map((c: any) => {
									const { id } = c
									return (
										<div className={styles['component-wrapper']} key={id}>
											<div className={styles['component']}>{genComponent(c)}</div>
										</div>
									)
								})}
								<div className={styles['footer']}>
									<Button type="primary" onClick={submitAnswer} loading={submitLoading}>
										提交
									</Button>
								</div>
								{device_info === 'PC' ? (
									<div className={styles['qr-code']}>
										<QRCode value={url} size={120} id="canvas"></QRCode>
										<div style={{ marginTop: '10px', fontSize: '16px' }}>扫一扫手机填写</div>
									</div>
								) : (
									''
								)}
							</div>
						</>
					) : (
						''
					)}
					{isSubmit && (
						<div className={styles['submit-success']}>
							<span>提交成功</span>
							<span className={styles['desc']}>感谢您的填写</span>
							<Button type="primary" onClick={() => nav('/')}>
								创建我的问卷
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
export default AnswerQues
