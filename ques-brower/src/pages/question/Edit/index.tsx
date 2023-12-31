import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import useLoadQuestionData from '../../../hooks/useLoadQUestionData'

const Edit: FC = () => {
	const { id } = useParams()
	const { loading, data } = useLoadQuestionData()
	return (
		<div>
			Edit-{id}-{loading}-{JSON.stringify(data)}
		</div>
	)
}

export default Edit
