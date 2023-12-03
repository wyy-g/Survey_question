module.exports = {
    OK: 200,
    CREATED: 201, //该请求已成功，并因此创建了一个新的资源。这通常是在 POST 请求，或是某些 PUT 请求之后返回的响应。
    BAD_REQUEST: 400, //请求格式错误或包含非法参数
    UNAUTHORIZED: 401, //客户端尝试访问受保护的资源，但没有提供有效的身份验证凭证
    FORBIDDEN: 403, //客户端尝试访问受保护的资源，但没有足够的权限。
    NOT_FOUND: 404, //服务器无法找到与请求 URI 匹配的资源。
    INTERNAL_SERVER_ERROR: 500
}