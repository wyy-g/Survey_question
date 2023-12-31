import React, { FC, useState, useEffect } from 'react'

type PropsType = {
	text: string
	time?: number
}

const TyperWriter: FC<PropsType> = props => {
	const { text, time = 100 } = props
	const [currentText, setCurrentText] = useState('')
	const [cursorPosition, setCursorPosition] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			if (cursorPosition !== text.length - 1) {
				setCurrentText(text?.slice(0, cursorPosition + 1))
				setCursorPosition(cursorPosition + 1)
			} else {
				clearInterval(timer)
			}
		}, time)
		return () => clearInterval(timer)
	}, [cursorPosition, currentText])

	return (
		<>
			<span>{currentText}</span>
			{cursorPosition !== text.length - 1 ? '|' : ''}
		</>
	)
}

export default TyperWriter
