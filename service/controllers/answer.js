const { getSubmissionModel,
    getAnswersBySubmissionId,
    delAnswersModel,
    delSubmissionsModel,
    addSubmissionModel,
    addAnswersModel,
    addFeedbackMOdel,
    getFeedbackModel,
    delFeedbackModel
} = require('../models/answer')
const { getSingleCom } = require('../models/questionCom');
const { addFeedbackNotificationModal } = require('../models/notification')
const { isHaveQues, getUserIdBySurveyId } = require('../models/common');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes')
const ExcelJS = require('exceljs');
const WebSocketManager = require('../utils/webSocketManager')

exports.getAnswers = async (req, res) => {
    const surveyId = req.params.id
    const { start_time, end_time } = req.query
    try {
        const submissions = await getSubmissionModel(parseInt(surveyId), start_time, end_time)
        // 创建一个Promise数组，用于并发获取每个提交的答案
        const answerPromises = submissions.map(async submission => {
            return await getAnswersBySubmissionId(submission.submission_id);
        });
        const allAnswers = await Promise.all(answerPromises);
        const answersList = submissions.map((submission, index) => ({
            ...submission,
            answers: allAnswers[index]
        }));
        res.status(OK).send({
            code: OK,
            msg: '',
            data: { answersList, count: submissions.length }
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

exports.delAnswer = async (req, res) => {
    const { ids } = req.body
    ids.forEach(async id => {
        await delAnswersModel(id)
        await delSubmissionsModel(id)
    })
    res.status(OK).send({
        code: OK,
        msg: '删除成功',
    })
}

exports.getAllQuesCom = async (req, res) => {
    try {
        const components = await getAllQuesComModel()
        res.status(OK).send({
            code: OK,
            msg: '',
            data: components
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

exports.downloadExcel = async (req, res) => {
    const surveyId = req.params.id
    const submissions = await getSubmissionModel(parseInt(surveyId))
    // 创建一个Promise数组，用于并发获取每个提交的答案
    const answerPromises = submissions.map(async submission => {
        return await getAnswersBySubmissionId(submission.submission_id);
    });
    const allAnswers = await Promise.all(answerPromises);
    const answersList = submissions.map((submission, index) => ({
        ...submission,
        answers: allAnswers[index]
    }));

    // 获取问卷标题
    const survey = await isHaveQues(parseInt(surveyId))

    // 创建一个新的工作簿
    const workbook = new ExcelJS.Workbook();

    // 创建工作表并填充数据
    const worksheet = workbook.addWorksheet('报告');
    // 定义表头
    const headers = ['提交ID', '开始时间', '提交时间', '设备信息', '浏览器信息', 'IP地址'];
    worksheet.columns = headers.map(header => ({ header, key: header }));

    for (const submissionWithAnswers of answersList) {
        const baseRowData = [
            submissionWithAnswers.submission_id,
            submissionWithAnswers.start_time,
            submissionWithAnswers.submit_time,
            submissionWithAnswers.device_info,
            submissionWithAnswers.browser_info,
            submissionWithAnswers.ip_address
        ];

        // 创建一个映射对象，用于存放标题和答案值的关系
        const answerMap = {};

        const answerPromises = submissionWithAnswers.answers.map(async (answer) => {
            const component_instance = await getSingleCom(answer.component_instance_id);

            // 检查标题是否已存在，不存在则添加到headers
            const title = component_instance[0]?.title;
            if (!headers.includes(title)) {
                headers.push(title);
            }

            // 将答案值与标题关联起来
            answerMap[title] = answer.answer_value;
        });

        // 等待所有异步操作完成
        await Promise.all(answerPromises);

        // 从映射对象中提取所有答案值，按headers顺序排列
        const answerValues = headers.slice(6).map(title => answerMap[title] || '');

        // 合并基础行数据和答案值
        const combinedRow = [...baseRowData, ...answerValues];

        // 添加一行到工作表中
        worksheet.addRow(combinedRow);
    }

    // 第二次设置头因为header变了,如果把上面的第一次去掉会丢失一行数据
    worksheet.columns = headers.map(header => ({ header, key: header }));

    // 设置所有列的宽度为10字符
    for (let columnIndex = 1; columnIndex <= headers.length; columnIndex++) {
        worksheet.getColumn(columnIndex).width = 10;
    }

    // 生成Excel文件并发送给客户端进行下载
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // 设置正确的文件名
    if (survey && survey.length > 0 && survey[0].title) {
        const fileName = encodeURIComponent(survey[0].title) + '.xlsx';
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    } else {
        // 如果获取不到标题，使用默认文件名
        res.setHeader('Content-Disposition', 'attachment; filename="survey_data.xlsx"');
    }
    await workbook.xlsx.write(res);
    res.end()
}

exports.submitAnswers = async (req, res) => {
    const { survey_id, device_info, browser_info, ip_address, startTime, writeAnswer } = req.body
    const result = await addSubmissionModel({ device_info, browser_info, ip_address, startTime, survey_id })
    // 提交记录的id
    const submission_id = result.insertId
    const answersPromises = writeAnswer.map(async (answerData) => {
        return await addAnswersModel({ ...answerData, submission_id });
    });
    try {
        // 等待所有答案插入完成
        await Promise.all(answersPromises);

        res.status(200).send({
            code: 200,
            msg: '提交问卷成功',
            data: { submission_id }
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
};

exports.addFeedback = async (req, res) => {
    const { survey_id, username, email, comment } = req.body
    try {
        // 向反馈表插入数据
        await addFeedbackMOdel({ survey_id, username, email, comment })
        // 通过问卷id获取用户id
        const userInfo = await getUserIdBySurveyId(survey_id)
        // 构建有反馈后向前端发送的信息
        const message = `关于你创建的${userInfo[0].title}问卷，用户在填写完之后提供了一些反馈和建议信息，快去看看吧。`
        if (userInfo[0].userId) {
            await addFeedbackNotificationModal(
                {
                    survey_id,
                    user_id: Number(userInfo[0].userId),
                    is_read: false,
                    message
                })
            // 通过WebSocket向用户发送消息
            WebSocketManager.sendMessageToUser(userInfo[0].userId, {
                action: 'new_feedback',
                survey_id,
                message,
                is_read: false
            })
        }
        res.status(200).send({
            code: 200,
            msg: '提交反馈成功',
        })
    } catch (error) {
        console.log('error', error)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}


exports.getFeedback = async (req, res) => {
    const { id } = req.params
    try {
        const data = await getFeedbackModel(id)
        res.status(200).send({
            code: 200,
            msg: '',
            data
        })
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

// 删除反馈记录
exports.delFeedback = async (req, res) => {
    const { id } = req.params
    try {
        await delFeedbackModel(Number(id))
        res.status(200).send({
            code: 200,
            msg: '删除反馈成功',
        })
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}
