const tencentcloud = require("tencentcloud-sdk-nodejs")

// 导入对应产品模块的client models。
const CvmClient = tencentcloud.tmt.v20180321.Client

// 实例化要请求产品(以cvm为例)的client对象
const tencentClient = new CvmClient({
    // 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中，请参考本文凭证管理章节。
    // 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
    credential: {
        secretId: process.env.TENCENT_ID,
        secretKey: process.env.TENCENT_KEY,
    },
    // 产品地域
    region: "ap-shanghai",
    // 可选配置实例
    profile: {
        signMethod: "TC3-HMAC-SHA256", // 签名方法
        httpProfile: {
            reqMethod: "POST", // 请求方法
            reqTimeout: 30, // 请求超时时间，默认60s
            // proxy: "http://127.0.0.1:8899" // http请求代理
        },
    },
})
// 通过client对象调用想要访问的接口（Action），需要传入请求对象（Params）以及响应回调函数
// 即：client.Action(Params).then(res => console.log(res), err => console.error(err))
// 如：查询云服务器可用区列表
module.exports = tencentClient
