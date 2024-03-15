import React, { useState, useEffect, useRef } from 'react'
import { message } from 'antd'
import { normalizeCommand, executeCommand } from '../utools/commandHandlers'

declare global {
	interface Window {
		webkitSpeechRecognition?: any
	}
}

type Recognition = any

const useVoiceToText = () => {
	// 初始化语音转文字的结果状态
	const [transcript, setTranscript] = useState('')
	// 是否已经在监听中
	const [isRecognizing, setIsRecognizing] = useState(false)

	// 创建一个ref来存储recognition实例，以便在外部函数中访问
	const recognitionRef = useRef<Recognition | undefined>(undefined)

	useEffect(() => {
		// 检查浏览器是否支持Web Speech API
		let recognition: Recognition | undefined
		if ('webkitSpeechRecognition' in window) {
			recognition = new (window as any).webkitSpeechRecognition()

			recognition.continuous = true //语音识别将在用户连续说话时持续进行
			recognition.interimResults = true //识别引擎会在识别过程中提供中间结果（初步识别结果）
			recognition.lang = 'zh-CN' //设置语言

			let finalTranscript = ''
			let executionTimeout: any
			recognition.onresult = (event: any) => {
				// const last = event.results.length - 1
				// const finalTranscript = event.results[last][0].transcript
				// setTranscript(finalTranscript)

				for (let i = event.resultIndex; i < event.results.length; ++i) {
					const transcriptChunk = event.results[i][0].transcript
					finalTranscript += transcriptChunk

					// 实时更新转录结果到父组件
					setTranscript(finalTranscript)
					// 得到得文字下面得做处理
					let execTranscript = finalTranscript
					// 这个得传过去因为要在ai创作哪里设置标题
					const titleTranscript = finalTranscript
					finalTranscript = ''

					if (event.results[i].isFinal) {
						clearTimeout(executionTimeout)

						// 预处理：去除末尾的标点符号和多余空格
						execTranscript = execTranscript
							.replace(/[.,!?;:!？。！…]/g, '')
							.trim()
							.replace(/\s+/g, '')

						// 生成一个什么什么得问卷 -> 得变成生成一个问卷才可以被执行
						if (execTranscript.includes('生成一个')) {
							execTranscript = '生成一个问卷'
						}

						if (execTranscript.includes('创建一个')) {
							execTranscript = '创建一个问卷'
						}
						// 此处执行预处理后的文本到指令的转换
						const normalizedCommand = normalizeCommand(execTranscript)

						// console.log('执行指令', normalizedCommand)
						// executeCommand(normalizedCommand, titleTranscript)

						// 设置定时器，1秒后执行指令
						executionTimeout = setTimeout(() => {
							executeCommand(normalizedCommand, titleTranscript)
							// recognition.stop()
						}, 1000)
					}
				}
			}

			// 将实例存入ref中
			recognitionRef.current = recognition

			recognition.onerror = (error: any) => {
				console.error('语音识别错误:', error)
				message.error('语音识别错误，请检查浏览器是否支持')
			}
		}
		// 组件卸载时清理资源
		return () => {
			recognition && (recognition.stop(), recognition.abort())
		}
	}, [])

	// 提供给外部使用的开始监听语音方法
	const startListening = () => {
		if (!isRecognizing && recognitionRef.current) {
			setIsRecognizing(true)
			recognitionRef.current.start()
		} else if (isRecognizing) {
			message.info('语音识别已在进行中，请先停止当前识别')
		}
	}

	// 提供给外部使用的停止监听语音方法
	const stopListening = () => {
		recognitionRef.current && recognitionRef.current.stop()
		setIsRecognizing(false)
	}

	// 提供给外部使用
	const clearTranscript = () => {
		setTranscript('')
	}

	// 返回状态和方法
	return [transcript, startListening, stopListening, clearTranscript]
}

export default useVoiceToText
