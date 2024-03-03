export default function addZero(num: number | string) {
	if (typeof num === 'string') return
	if (num < 10) {
		return '0' + num
	} else {
		return num
	}
}
