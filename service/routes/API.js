const API = {
    USER: {
        register: '/api/user/register',
        login: '/api/user/login',
        info: '/api/user/info'
    },
    SURVEYS: {
        createQues: `/api/question/create`,
        questionList: `/api/question/all_ques`,
        quesStar: `/api/question/star`,
        quesDel: `/api/question/delete`,
        hiddenQues: '/api/question/hidden',
        setQuesStarStatus: '/api/question/setStarStatus',
        recoverQues: '/api/question/recoverQues/:id',
        deleteQues: '/api/question/deleteQues/:id',
    }
}

module.exports = API