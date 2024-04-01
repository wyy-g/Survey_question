import React, { FC, useState } from 'react'
import { Upload, Typography, message } from 'antd'
import { useParams } from 'react-router-dom'

import type { UploadProps } from 'antd'
import { QuestionFilePropsType, QuestionFileDefaultProps } from './interface'
import IconFont from '../../../utools/IconFont'
import addZero from '../../../utools/addZero'
import styles from '../common.module.scss'
import { uploadAnswersFileApi } from '../../../services/answer'

const { Paragraph } = Typography
const { Dragger } = Upload

const QuestionFile: FC<QuestionFilePropsType> = (props: QuestionFilePropsType) => {
	const {
		title,
		placeholder,
		isShowTitle,
		isMustFill,
		order_index,
		isShowOrderIndex,
		onValueChange,
		isShowWarning,
		customErrorMessage,
		uploadMaxNum,
		uploadMinNum,
		fileType,
		singleFileSize,
	} = {
		...QuestionFileDefaultProps,
		...props,
	}

	// 问卷id
	const { id: surveyId } = useParams()
	const [uploadFileList, setUploadFileList] = useState<any[]>([])

	// 为 Upload 组件添加 accept 属性，根据 fileType 设置限制上传的文件类型
	const accept = {
		all: '*/*',
		documents: ['.doc', '.docx', '.pdf', '.xls', '.xlsx'].join(','), // 其他文档格式...
		images: 'image/*',
		videos: 'video/*',
		audio: 'audio/*',
	}[fileType!]

	function handlValueChange() {
		const uploadDoneUrls = uploadFileList.map(item => item.url)
		onValueChange && onValueChange(JSON.stringify(uploadDoneUrls))
	}

	function handleRemove(file: any) {
		const updatedList = uploadFileList.filter(item => item.uid !== file.uid)
		setUploadFileList(updatedList)
	}

	const uploadProps: UploadProps = {
		maxCount: uploadMaxNum,
		name: 'file',
		multiple: true,
		accept: accept || '*',
		onChange(info) {
			const { status } = info.file
			if (status === 'done') {
				handlValueChange()
				message.success(`上传文件${info.file.name}成功`)
			} else if (status === 'error') {
				message.error(`上传文件${info.file.name}失败`)
			}
		},
		beforeUpload: file => {
			const isScpoe = file.size / 1024 / 1024 < Number(singleFileSize!)
			if (!isScpoe) {
				message.error(`文件大小支持${Number(singleFileSize!)}M，请重新上传`)
				return false
			}
		},
		customRequest: async (fileDetail: any) => {
			const formData = new FormData()
			formData.append('uploadAnswersFile', fileDetail.file)
			if (formData && surveyId) {
				if (Number(uploadMaxNum) > uploadFileList.length) {
					try {
						const uploadRes = await uploadAnswersFileApi(
							surveyId,
							formData,
							`uploadAnswers${fileDetail.file.type.split('/')[0]}`,
						)
						const newFile = {
							url: uploadRes.url,
							uid: fileDetail.file.uid,
							name: fileDetail.file.name,
						}
						setUploadFileList([...uploadFileList, newFile])
						setTimeout(() => {
							fileDetail.onSuccess(uploadRes.url, fileDetail.file)
						}, 1)
					} catch (error) {
						fileDetail.onError(error, fileDetail.file)
					}
				} else {
					message.warning(`只能上传 ${Number(uploadMaxNum)} 个文件`)
				}
			}
		},
		fileList: uploadFileList.map(file => ({
			uid: file.uid,
			name: file.name,
			status: 'done',
			url: file.url,
		})),
		listType: 'picture',
		onRemove: file => handleRemove(file),
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
			<div style={{ marginLeft: '15px', marginBottom: '10px' }}>
				<Dragger {...uploadProps}>
					<p className="ant-upload-drag-icon">
						<IconFont type="icon-wenjian" />
					</p>
					<p className="ant-upload-text">
						{Number(uploadMaxNum) > Number(uploadMinNum)
							? `选择上传至少 ${Number(uploadMinNum)} 个,最多 ${Number(uploadMaxNum)} 个文件`
							: `选择上传 ${Number(uploadMaxNum)} 个文件`}
					</p>
					<p className="ant-upload-hint">每个文件最大 {Number(singleFileSize)} M</p>
				</Dragger>
			</div>
			{uploadFileList.length < uploadMinNum! && isShowWarning && (
				<span className={styles['warning']}>
					<IconFont type="icon-xianshi_jinggao" style={{ marginRight: '4px' }}></IconFont>
					{customErrorMessage}
				</span>
			)}
		</div>
	)
}

export default QuestionFile
