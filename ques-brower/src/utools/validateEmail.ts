// 邮箱的验证规则
export default function validateEmail(_: any, value: any) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return !value || emailPattern.test(value)
		? Promise.resolve()
		: Promise.reject(new Error('请输入有效的邮箱地址'))
}
