import React, { FC, useState, useEffect, useRef } from 'react'
import { Button } from 'antd'
import IconFont from '../../utools/IconFont'
import styles from './index.module.scss'
import useVoiceToText from '../../hooks/useVoiceToText'

const VoiceAssistant: FC = () => {
	// 是否展示输入框
	const [isShowVoiceInput, setIsShowVoiceInput] = useState(false)
	const previousShowInputRef = useRef(isShowVoiceInput)
	// 语音识别的hook
	const [transcript, startListening, stopListening, clearTranscript] = useVoiceToText() as [
		string,
		() => void,
		() => void,
		() => void,
	]

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

	function handleShowInput() {
		setIsShowVoiceInput(!isShowVoiceInput)
	}

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
