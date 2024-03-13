import { message } from 'antd'
// 定义指令集
const commandSet: any = {
	openAiCreation: ['打开AI创作', '请给我打开AI创作', '给我打开AI创作', '给我打开a创作', 'AI创作'], // 关联同一处理函数的不同命令表达
	closeAiCreation: ['关闭AI创作'],
	generateQuestion: ['生成一个问卷'],
	createdAiQuestion: ['创建一个问卷'],
	closeVoiceAssistant: ['关闭语音助手'],
}

// 指令归一化处理函数
export function normalizeCommand(command: any) {
	for (const [normalizedCommand, aliases] of Object.entries(commandSet)) {
		if ((aliases as any).includes(command)) {
			return normalizedCommand
		}
	}

	return command
}

// 定义指令与组件动作的映射表
const commandActions: any = {
	openAiCreation: {
		target: 'openAiCreationModal',
	},
	closeAiCreation: {
		target: 'closeAiCreationModal',
	},
	generateQuestion: {
		target: 'generateCustomQuestion',
	},
	createdAiQuestion: {
		target: 'createdAiQuestion',
	},
	closeVoiceAssistant: {
		target: 'closeVoiceAssistant',
	},
	// 其他指令与组件动作映射...
}

// 全局指令处理注册表
export const commandRegistry = new Map()

// 执行全局指令处理逻辑
export function executeCommand(command: string, theme?: string) {
	const handler = commandRegistry.get(command)
	if (handler) {
		const actionConfig = commandActions[normalizeCommand(command)]

		if (
			actionConfig &&
			actionConfig.target &&
			typeof handler.current[actionConfig.target] === 'function'
		) {
			handler.current[actionConfig.target](theme)
		} else {
			message.warning('未知的指令或无效的方法')
			console.log(`未知的指令或无效的方法：${command}`)
		}
	} else {
		message.warning('未找到处理命令')
		console.log(`未找到处理命令：${command}`)
	}
}
