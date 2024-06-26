const API = {
	USER: {
		register: '/api/user/register',
		login: '/api/user/login',
		info: '/api/user/info',
		updateUserInfo: '/api/user/update',
		updateUserPassword: '/api/user/updatePassword',
	},
	SURVEYS: {
		createQues: `/api/question/create`,
		questionList: `/api/question/all_ques`,
		quesStar: `/api/question/star`,
		quesDel: `/api/question/delete`,
		hiddenQues: '/api/question/hidden',
		setQuesStarStatus: '/api/question/setStarStatus',
		recoverQues: '/api/question/recoverQues/:id',
		deleteQues: '/api/question/deleteQues',
		searchQues: '/api/question/searchQues',
		sortQues: '/api/question/sortQues',
		getOneQues: `/api/question/`,
		updateQues: `/api/question/`,
		copyQues: `/api/question/duplicate/`,
		translateQues: `/api/question/translate`,
	},
	QUES_COM: {
		getAllQuesCom: '/api/questionComponents',
	},
	PROBLEMS: {
		getAllProblems: '/api/problem/:id',
	},
	ANSWER: {
		getSingleAnswers: '/api/answers/',
		delAnswer: '/api/answers',
		downloadExcel: '/api/download/',
		submitAnswer: '/api/answers',
		feedback: '/api/feedback/',
		uploadFile: '/api/uploadAnswerFile',
	},
	UPLOADIMG: '/api/uploadimg',
	AI: '/api/generate/gpt',
	CREATEDQUESBYAI: '/api/createAiQues',
	SENDEMAILCODE: '/api/sendEmailCode',
	VERIFSUBMITYCODE: '/api/verifyCode',
	FEEDBACKNOTIFICARION: '/api/feedbackNotification/',
	FEEDBACKNOTIFICARIONALL: '/api/feedbackNotificationAll/',
}

export default API
