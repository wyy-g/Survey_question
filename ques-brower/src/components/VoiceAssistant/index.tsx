import React, { FC, useState, useEffect, useRef } from 'react'
import { Button, Card } from 'antd'
import IconFont from '../../utools/IconFont'
import styles from './index.module.scss'
import useVoiceToText from '../../hooks/useVoiceToText'
import { commandRegistry, normalizeCommand } from '../../utools/commandHandlers'
import { useDebounceFn } from 'ahooks'

const VoiceAssistant: FC = () => {
	// 是否展示输入框
	const [isShowVoiceInput, setIsShowVoiceInput] = useState(false)
	const previousShowInputRef = useRef(isShowVoiceInput)
	// 说明是否显示
	const [isSHowExplain, setIsShowExplain] = useState(false)
	// 语音识别的hook
	const [transcript, startListening, stopListening, clearTranscript] = useVoiceToText() as [
		string,
		() => void,
		() => void,
		() => void,
	]

	const componentRef = useRef({
		closeVoiceAssistant: () => setIsShowVoiceInput(false),
	})

	useEffect(() => {
		commandRegistry.set(normalizeCommand('关闭语音助手'), componentRef)
		return () => {
			commandRegistry.delete('关闭语音助手')
		}
	}, [componentRef])

	useEffect(() => {
		console.log('transcript', transcript)
	}, [transcript])

	useEffect(() => {
		if (previousShowInputRef.current !== isShowVoiceInput) {
			if (isShowVoiceInput) {
				startListening()
			} else {
				clearTranscript()
				stopListening()
			}
			previousShowInputRef.current = isShowVoiceInput
		}
	}, [isShowVoiceInput, startListening, stopListening])

	const { run: handleShowInput } = useDebounceFn(() => setIsShowVoiceInput(!isShowVoiceInput), {
		wait: 250,
	})

	// function handleShowInput() {
	// 	setIsShowVoiceInput(!isShowVoiceInput)
	// }

	return (
		<div className={styles['voice-wrapper']}>
			<Button
				style={{ width: '50px', height: '50px', fontSize: '24px' }}
				shape="circle"
				type="primary"
				onClick={handleShowInput}
			>
				<IconFont type="icon-yuyin" />
			</Button>
			<IconFont
				className={styles.promap}
				type="icon-wenhao"
				onClick={() => setIsShowExplain(!isSHowExplain)}
			></IconFont>
			{isSHowExplain && (
				<Card className={styles.explain} title="语音助手指令使用说明" style={{ width: 400 }}>
					<p>1、打开AI创作</p>
					<p>2、关闭AI创作</p>
					<p>3、生成一个*****的问卷，既可以在打开AI创作后说，也可以在初始化的时候说</p>
					<p>4、创建一个*****的问卷，既可以在打开AI创作后说，也可以在初始化的时候说</p>
					<p>5、关闭语音助手</p>
				</Card>
			)}
			{isShowVoiceInput && (
				<div className={styles['voice-input']}>
					<div className={styles['input-with-icon']}>
						<input
							className={styles['input']}
							autoFocus={isShowVoiceInput}
							value={transcript}
							placeholder="试一下说创建一个大学生暑假计划问卷"
							readOnly
						></input>
						<IconFont type="icon-yuyin" className={styles['input-icon']} />
					</div>
				</div>
			)}
		</div>
	)
}

export default VoiceAssistant
