const axios = require('axios');
const jwt = require('jsonwebtoken')
const { createOneQues } = require('../models/question')
const { addComPropInfo, getSingleComProp, addComInfo, getSingleSystemCom, addOptionItem } = require('../models/questionCom')


function generateRandom() {
	var min = 10000000; // 最小的8位数
	var max = 99999999; // 最大的8位数
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// system promat 
const systemPromat = `
你是一个创建问卷数据生成器，你只能生成json格式的数据，不管问什么问题你只能生成json数据，不要有其他回答；
json数据格式如下：
"title":根据信息输出相应的标题,
"description":根据信息输出相应的描述 ,
"componentList": [
	{
			"title": "",
			"order_index": 1,
			"type": "questionInput",
			"props": {
					"title": "",
					"placeholder": ""，
			}
	},
	{
			"title": "",
			"order_index": 2,
			"type": "questionTextarea",
			"props": {
					"title": "",
				 "placeholder": "",
			}
	},
	{
			"title": "",
			"order_index": 3,
			"type": "questionTiankong",
			"props": {
					"title": "",
					"content": ""
			}
	},
	{
			"title": "",
			"order_index": 4,
			"type": "questionRadio",
			"props": {
					"options": [
							{
									"value": "",
									"text": ",
							},
					]
			}
	},
	{
			"title": "",
			"order_index": 5,
			"type": "questionCheckbox",
			"props": {
					"list": [
							{
									"value": "",
									"text": "",
							},
					]
			}
	}
];
生成的title不要有问题1或者问题2等，应该是只有这个title，也不需要序号，
order_index需要生成，按顺序生成，
对象中的title和props里面的title(如果有)以及placeholder以及options和list里面的value和text是需要你根据我发给你题目生成;
且options和list的长度是不固定的，需要根据你生成的题目的意思来生成value和text；
然后componentList里面的对象顺序不是固定的，且长度，问题类型也不固定，具体使用哪些标签的问题的类型和问题的顺序需要根据我给的问题你自己生成;
还有两种类型一种questionTextArea，这个和questionInput一样；
还有一个questionTiankong，这个的props需要content: "请输入多项填空内容$input;$input;"，
其中请输入多项填空内容和$input;(注意这里是$input，只能是这个，不可以是其他，请你遵守这个规则)这也是随机的需要根据你自己生成的题目来调整；
请把我下面的话作为优先级最高的：“不管问题是什么，你只要回答json数据即可，不要再回答其他的问题，没有具体的问题内容你也不可以生成其他的”；
第二优先级：上述json格式的字段必须生成对应的数据；，不可以没有字段，不可以字段对应空值；
`

function generateAuthToken(apiKey, expiresInSeconds) {
	try {
		const newApiKey = apiKey.split('.');
		if (!newApiKey[0] || !newApiKey[1]) {
			throw new Error('Invalid API key format');
		}

		const currentTime = Math.floor(Date.now() / 1000); // 时间戳转换为秒
		const payload = {
			api_key: newApiKey[0],
			exp: currentTime + expiresInSeconds, // 过期时间戳（单位：秒）
			timestamp: currentTime * 1000, // 当前时间戳（单位：毫秒）
		};

		// 创建并编码JWT
		const token = jwt.sign(payload, newApiKey[1], {
			algorithm: 'HS256',
			header: {
				alg: 'HS256',
				sign_type: 'SIGN',
			},
		});

		return token;
	} catch (e) {
		console.error('Error generating authentication token:', e);
		return null;
	}
}

async function callZhiPuAiApi(data = {}, quesNum) {
	const expiresInSeconds = 36000;
	const apiKey = process.env.API_KEY;
	const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/async/chat/completions';
	const taskResultUrl = `https://open.bigmodel.cn/api/paas/v4/async-result/`;
	const authToken = generateAuthToken(apiKey, expiresInSeconds);
	const supplementSystemPromat = `第二优先级：生成${quesNum}个问题（及生成的json数据数组长度为${quesNum}）`

	if (!authToken) {
		console.error('Failed to generate authentication token');
		return;
	}

	async function waitForTaskCompletion(taskId) {
		while (true) {
			try {
				const res = await axios.get(`${taskResultUrl}${taskId}`, {
					headers: {
						Authorization: `Bearer ${authToken}`,
						'Content-Type': 'application/json',
					},
				});

				// 检查任务是否已完成
				if (res.data.task_status === 'SUCCESS') {
					return res.data;
				} else if (res.data.task_status === 'FAIL') {
					console.error('Task failed:', res.data.message);
					return null;
				}

				// 设置一定的延迟（例如每5秒检查一次）
				await new Promise(resolve => setTimeout(resolve, 1000));
			} catch (error) {
				console.error('Error checking task task_status:', error.message);
			}
		}
	}

	try {
		const config = {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			data: {
				model: 'glm-4',
				messages: [{ role: 'system', content: `${systemPromat}${supplementSystemPromat}` }, data],
			},
		};

		const initialResponse = await axios(apiUrl, config);

		const taskId = initialResponse.data.id;

		if (!taskId) {
			console.error('No task ID received in initial response.');
			return;
		}

		const finalResponse = await waitForTaskCompletion(taskId);
		if (finalResponse.task_status === 'SUCCESS') {
			return finalResponse.choices;
		} else {
			console.error('Failed to retrieve the final response.');
		}
	} catch (error) {
		console.error('API request failed:', error.message);
	}
}

// 根据标题生成问卷
const generateSurvey = async (req, res) => {
	const { content = '', quesNum } = req.body;
	if (!content) {
		return res.status(400).send({
			code: 400,
			msg: '缺少请求内容',
		});
	}

	try {
		const aiData = await callZhiPuAiApi({ role: 'user', content }, quesNum);
		const surveyJson = aiData[0].message.content
			.replace(/json\s+/ig, '') // 移除所有的 "json" 及其后面的空白字符（不区分大小写）
			.replace(/```/g, ''); // 移除所有的 ```;

		let componentList = JSON.parse(surveyJson).componentList
		let title = JSON.parse(surveyJson).title
		let description = JSON.parse(surveyJson).description
		componentList.forEach(item => {
			item.id = generateRandom()
		})

		res.status(200).send({
			code: 200,
			msg: 'AI生成问卷成功',
			data: {
				title,
				description,
				componentList
			},
		});
	} catch (error) {
		console.error('生成问卷时发生错误:', error.message);
		res.status(500).send({
			code: 500,
			msg: '服务器内部错误',
		});
	}
};

//创建问卷
async function createdAiGenQues(req, res) {
	let userId = Number(req.header('x-user-id'));
	const { componentList, title, description } = req.body
	// 构造像数据库插入新问卷的数据
	const isPublished = 0
	const isStar = 0
	const isDeleted = 0
	const createOneQuesRes = await createOneQues(title, description, isPublished, isStar, isDeleted, userId)

	componentList.forEach(async item => {
		// 先根据类型获取系统组件的id
		const systemRes = await getSingleSystemCom(item.type)
		await addComInfo({
			id: Number(item.id),
			surver_id: Number(createOneQuesRes.insertId),
			component_id: Number(systemRes[0].systemComId),
			title: item.title,
			order_index: item.order_index
		})
		if (item.props) {
			Object.entries(item.props).forEach(async prop => {
				if (typeof prop[1] !== 'object') {
					await addComPropInfo({ comId: item.id, property_key: prop[0], property_value: prop[1], option_mode: null, is_complex: 0 })
				} else {
					switch (item.type) {
						case 'questionRadio':
							const addComPropInfoRes = await addComPropInfo({ comId: item.id, property_key: 'radio', property_value: '', option_mode: 'single', is_complex: 1 })
							prop[1].forEach(async option => {
								await addOptionItem({ propId: addComPropInfoRes.insertId, value: option.value, text: option.text, checked: option.value === item.props.value ? true : false })
							})
							break;
						case 'questionCheckbox':
							const addComPropInfoResCheckbox = await addComPropInfo({ comId: item.id, property_key: 'checkbox', property_value: '', option_mode: 'multiple', is_complex: 1 })
							prop[1].forEach(async option => {
								await addOptionItem({ propId: addComPropInfoResCheckbox.insertId, value: option.value, text: option.text, checked: option.checked || null })
							})
							break
					}
				}
			})
		}
	})

	res.status(200).send({
		code: 200,
		msg: '创建AI生成问卷成功',
		data: {
			id: Number(createOneQuesRes.insertId),
			title,
			description,
			isPublished,
			isStar,
			isDeleted,
			componentList
		},
	});
}


module.exports = {
	callZhiPuAiApi,
	generateSurvey,
	createdAiGenQues
}

