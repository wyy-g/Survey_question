import React, { FC, useState, useEffect } from 'react'
import { Empty, Button, Spin, message, Space, Select } from 'antd'
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
import { getQuesInfoService, translateQues } from '../../services/question'
import { submitAnswers } from '../../services/answer'
import styles from './index.module.scss'
import { ComponentInfoType } from '../../store/componentReducer'
import { getComponentConfByType } from '../../components/QuestionComponents'
import Feedback from './FeedBack'
import { multiLangOptions, LanguageOption } from '../../utools/const'
import {
	collectStringsForTranslation,
	replaceTextInDataStructure,
} from '../../utools/collectStringsForTranslation'
import zh from '../../locals/zh'
import en from '../../locals/en'
import ja from '../../locals/ja'

const AnswerQues: FC = () => {
	const nav = useNavigate()
	const { id = '' } = useParams()

	const [isSubmit, setIsSubmit] = useState(false)
	// 提交问卷的loading防止多次提交
	const [submitLoading, setSubmitLoading] = useState(false)

	const [isPublished, setIsPublished] = useState(false)
	// 是否显示反馈
	const [isEnableFeedback, setIsEnableFeedback] = useState(false)
	// 问卷有效时间
	const [validStartTime, setValidStartTime] = useState('')
	const [validEndTime, setValidEndTime] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [componentList = [], setComponentList] = useState<ComponentInfoType[]>([])
	const [startTime, setStartTime] = useState<string>('')
	const [submitLocationInfo, setSubmitLocationInfo] = useState<{ [key: string]: string }>({})
	const [device_info, setDevice_info] = useState('')
	const [browser_info, setBrowser_info] = useState('')
	const [writeAnswer, setWriteAnswer] = useState<{ [key: string]: string | number }[]>([])
	const [isMultiLang, setIsMultiLang] = useState(false)
	const [lang, setLang] = useState<string[]>([])
	const [defaultLang, setDefaultLang] = useState('')

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
				setIsEnableFeedback(data!.isEnableFeedback)
				setComponentList(data!.componentList)
				setTitle(data!.title)
				setDescription(data!.description)
				setValidStartTime(moment.utc(data!.startTime).local().format('YYYY-MM-DD HH:mm:ss'))
				setValidEndTime(moment.utc(data!.endTime).local().format('YYYY-MM-DD HH:mm:ss'))
				setIsMultiLang(data!.isMultiLang)
				setLang(data!.lang)
				setDefaultLang(data!.defaultLang)
			},
		},
	)

	const { texts, paths } = collectStringsForTranslation({
		title,
		description,
		componentList,
	})

	// 翻译接口
	const { run: translateTextService, loading: tarnslateLoading } = useRequest(
		async (SourceTextList, targetLang) => {
			const data = await translateQues({
				SourceTextList,
				Source: 'auto',
				Target: targetLang,
				ProjectId: 1313566,
			})
			return data
		},
		{
			manual: true,
			onSuccess(res) {
				const translatedTexts = res.TargetTextList
				if (translatedTexts.length) {
					const translationMap = paths.reduce(
						(acc, path, index) => {
							acc[path] = translatedTexts[index]
							return acc
						},
						{} as Record<string, string>,
					)
					const translateResData = replaceTextInDataStructure(
						{ title, description, componentList },
						translationMap,
					)
					console.log('translateResData', translateResData)
					setTitle(translateResData!.title)
					setDescription(translateResData!.description)
					setComponentList(translateResData!.componentList)
				}
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
		answer_value: string | number,
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

	function genComponent(componentInfo: ComponentInfoType, isShowWarning: boolean) {
		const { type, props, title, order_index, id } = componentInfo
		const componentConf = getComponentConfByType(type)
		if (!componentConf) return
		const { Component } = componentConf
		const newProps = {
			...props,
			title,
			order_index,
			isShowWarning,
		}
		return <Component {...newProps} onValueChange={value => handleValueChange(value, id, type)} />
	}

	// 子组件是否必填状态下是否显示警告
	const [childWarnings, setChildWarnings] = useState<{ [key: string | number]: boolean }>({})
	// 验证所有子组件的输入值
	const validateForm = () => {
		let hasEmptyField = false
		// 每个子组件是否要显示警告
		const newChildWarnings: { [key: string | number]: boolean } = {}

		for (const component of componentList as ComponentInfoType[]) {
			if (
				component.props.isMustFill &&
				!writeAnswer.some(
					(answer: any) => answer.component_instance_id === component.id && answer.answer_value,
				)
			) {
				newChildWarnings[component.id] = true
				hasEmptyField = true
			} else {
				newChildWarnings[component.id] = false
			}
		}

		setChildWarnings(newChildWarnings)
		return !hasEmptyField
	}

	async function submitAnswer() {
		// 获取设别信息
		if (!validateForm()) return
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

	// 判断当前时间是否在有效时间中
	function currenTimeIsValid() {
		return moment().isBetween(validStartTime, validEndTime)
	}

	// 可切换的语言
	const [filterLang, setFilterLang] = useState<LanguageOption[]>([])
	const [currentLang, setCurrentLang] = useState(defaultLang)
	useEffect(() => {
		const selectLang = multiLangOptions.filter(item => lang?.includes(item.value))

		setFilterLang(selectLang)
	}, [isMultiLang, multiLangOptions])

	// 处理选择语言
	function handleLangChange(value: string) {
		translateTextService(texts, value)
		setCurrentLang(value)
	}

	// 处理多语言
	function moreLang(field: string) {
		switch (currentLang) {
			case 'zh':
				/* eslint-disable */
				//@ts-ignore
				return zh.answerQuse[field]
			case 'en':
				/* eslint-disable */
				//@ts-ignore
				return en.answerQuse[field]
			case 'ja':
				/* eslint-disable */
				//@ts-ignore
				return ja.answerQuse[field]
			default:
				/* eslint-disable */
				//@ts-ignore
				return zh.answerQuse[field]
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
					{!isPublished || !currenTimeIsValid() ? (
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
					{isPublished && currenTimeIsValid() && !isSubmit ? (
						<>
							<div className={styles['answer-ques-wrapper']}>
								{isMultiLang ? (
									<div className={styles['lang-select']}>
										<Select
											defaultValue={defaultLang || 'zh'}
											style={{ width: 120 }}
											onChange={handleLangChange}
											options={filterLang}
										/>
									</div>
								) : (
									<div></div>
								)}
								<div className={styles['header']}>
									<div className={styles['title']}>{title}</div>
									<div className={styles['desc']}>{description}</div>
								</div>
								{componentList.map((c: any) => {
									const { id } = c
									return (
										<div className={styles['component-wrapper']} key={id}>
											<div className={styles['component']}>
												{genComponent(c, childWarnings[c.id])}
											</div>
										</div>
									)
								})}
								<div className={styles['footer']}>
									<Button type="primary" onClick={submitAnswer} loading={submitLoading}>
										{moreLang('submit')}
									</Button>
								</div>
								{device_info === 'PC' ? (
									<div className={styles['qr-code']}>
										<QRCode value={url} size={120} id="canvas"></QRCode>
										<div style={{ marginTop: '10px', fontSize: '16px' }}>
											{moreLang('scanQrCode')}
										</div>
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
							<Space>
								<Button type="primary" onClick={() => nav('/')}>
									创建我的问卷
								</Button>
								{isEnableFeedback ? <Feedback survey_id={Number(id)} /> : ''}
							</Space>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
export default AnswerQues
