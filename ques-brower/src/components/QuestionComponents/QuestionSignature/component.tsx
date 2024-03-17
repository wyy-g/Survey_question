import React, { FC, useRef, useState } from 'react'
import { Button, Typography, Space } from 'antd'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'
/* eslint-disable */
// @ts-ignore
import SignatureCanvas from 'react-signature-canvas'
import { QuestionSingaturePropsType, QuestionSignatureDefaultProps } from './interface'

const { Paragraph } = Typography

const QusetionSignature: FC<QuestionSingaturePropsType> = (props: QuestionSingaturePropsType) => {
	const {
		title,
		placeholder,
		isShowTitle,
		isMustFill,
		order_index,
		isShowOrderIndex,
		onValueChange,
		isShowWarning,
		color,
		customErrorMessage,
	} = {
		...QuestionSignatureDefaultProps,
		...props,
	}

	const signatureRef = useRef<SignatureCanvas | null>(null)
	const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true) // 初始时占位提示可见
	// 是否确认上传
	const [isConfirm, setIseCOnfirm] = useState(false)

	// 清除签名
	const clearSignature = () => {
		signatureRef.current && signatureRef.current.clear()
		setIseCOnfirm(false)
	}

	// 获取签名图像数据
	const getSignatureImage = () => {
		const imageData = signatureRef.current.toDataURL()
		onValueChange && onValueChange(imageData)
		setIseCOnfirm(true)
	}

	return (
		<div>
			<div>
				{isShowTitle && (
					<Paragraph strong style={{ fontSize: '16px' }}>
						{isMustFill && <IconFont type="icon-bitian" />}
						{!!isShowOrderIndex && <span>{addZero(order_index!)}&nbsp;</span>}
						<span style={{ marginLeft: '2px' }}>{title}</span>
					</Paragraph>
				)}
			</div>
			<div style={{ position: 'relative', width: '500px', height: '200px', marginLeft: '15px' }}>
				<SignatureCanvas
					ref={signatureRef}
					canvasProps={{
						width: 500,
						height: 200,
						style: {
							backgroundColor: '#F0F2F5',
							border: '1px dashed #707880',
							// width: '100%',
							// height: '100%',
						},
					}}
					onBegin={() => setIsPlaceholderVisible(false)}
					penColor={color}
				/>
				{isPlaceholderVisible && (
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					>
						{placeholder}
					</div>
				)}
			</div>

			<div style={{ marginTop: '15px', marginBottom: '10px', marginLeft: '15px' }}>
				<Space>
					<Button onClick={clearSignature} disabled={isPlaceholderVisible}>
						重写
					</Button>
					<Button onClick={getSignatureImage} disabled={isPlaceholderVisible || isConfirm}>
						确认
					</Button>
				</Space>
			</div>
			{isShowWarning && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QusetionSignature
