import React, { FC, useState, useEffect } from 'react'
/* eslint-disable */
// @ts-ignore
import ReactCrop from 'react-easy-crop'

type AvatarEditorElemProps = {
	imageUrl: string
	onCroppedImage?: (croppedImage: Blob) => void
}

interface CroppedAreaPixelsInfo {
	x: number
	y: number
	width: number
	height: number
}

const AvatarEditorElem: FC<AvatarEditorElemProps> = (props: AvatarEditorElemProps) => {
	const { imageUrl = '', onCroppedImage } = props

	// 初始化裁剪区域的位置和缩放值
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)

	// 存储裁剪后像素坐标信息，用于获取裁剪后的图片
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixelsInfo | null>(null)

	// 当裁剪完成后，更新裁剪像素坐标
	const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}

	// 当裁剪框的位置发生变化时，更新裁剪区域的位置
	const onCropChange = (newCrop: any) => {
		setCrop(newCrop)
	}

	// 当缩放值发生变化时，更新裁剪框的缩放级别
	const onZoomChange = (newZoom: any) => {
		setZoom(newZoom)
	}

	useEffect(() => {
		if (croppedAreaPixels && imageUrl) {
			// 使用HTML5 Canvas生成裁剪图片的Blob对象
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			// 设置canvas尺寸为裁剪区域尺寸
			canvas.width = croppedAreaPixels.width!
			canvas.height = croppedAreaPixels.height

			// 将原图绘制到canvas上，裁剪指定区域
			const img = new Image()
			img.src = imageUrl

			img.onload = () => {
				ctx!.drawImage(
					img,
					croppedAreaPixels.x,
					croppedAreaPixels.y,
					croppedAreaPixels.width,
					croppedAreaPixels.height,
					0,
					0,
					croppedAreaPixels.width,
					croppedAreaPixels.height,
				)

				// 将canvas转为Blob对象
				canvas.toBlob(
					blob => {
						onCroppedImage!(blob as Blob)
					},
					'image/jpeg',
					0.9,
				)
			}
		}
	}, [[croppedAreaPixels, imageUrl, onCroppedImage]])

	return (
		<div style={{ position: 'relative', width: 630, height: 250 }}>
			<ReactCrop
				image={imageUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={onCropChange}
				onCropComplete={onCropComplete}
				onZoomChange={onZoomChange}
				aspect={1}
			/>
		</div>
	)
}

export default AvatarEditorElem
