const API = {
    USER: {
        register: '/api/user/register',
        login: '/api/user/login',
        info: '/api/user/info',
        updateUserInfo: '/api/user/update'
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
        getOneQues: `/api/question/:id`,
        updateQues: `/api/question/:id`,
        copyQues: `/api/question/duplicate/:id`
    },
    QUES_COM: {
        getAllQuesCom: '/api/questionComponents'
    },
    PROBLEMS: {
        getAllProblems: '/api/problem/:id'
    },
    ANSWER: {
        getSingleAnswers: '/api/answers/:id',
        delAnswer: '/api/answers',
        downloadExcel: '/api/download/:id',
        submitAnswer: '/api/answers',
        feedback: '/api/feedback/:id'
    },
    UPLOADIMG: '/api/uploadimg',
    AI: '/api/generate/gpt',
    CREATEDQUESBYAI: '/api/createAiQues',
    SENDEMAILCODE: '/api/sendEmailCode',
    VERIFSUBMITYCODE: '/api/verifyCode',
    FEEDBACKNOTIFICARION: '/api/feedbackNotification/:id',
    FEEDBACKNOTIFICARIONALL: '/api/feedbackNotificationAll/:id'

}

module.exports = API