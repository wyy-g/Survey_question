import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

const QuestionLayout: FC = () => {
	return (
		<div>
			<div>QuestionLayout Header</div>
			<div>
				<Outlet />
			</div>
			<div>QuestionLayout Footer</div>
		</div>
	)
}

export default QuestionLayout
