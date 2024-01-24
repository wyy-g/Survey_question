import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserIdStorage } from '../utools/user-storage'
import { LOGIN_PATHNAME, REGISTER_PATHNAME, HOME_PATHNAME } from '../router'

export default function useRouteGuard(waitingUserData?: boolean) {
	const nav = useNavigate()
	const { pathname } = useLocation()
	const userId = getUserIdStorage()

	useEffect(() => {
		// if (waitingUserData) return
		if (!userId && ![LOGIN_PATHNAME, REGISTER_PATHNAME, HOME_PATHNAME].includes(pathname)) {
			//用户未登录且不在登录和注册及首页页面，然后在地址栏访问其他页面则重定向到登录页
			nav(LOGIN_PATHNAME)
		}
		if (userId && [LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname)) {
			// 已登录但访问登录或注册页面，则重定向到首页或其他受保护的页面
			console.log(123)
			nav(HOME_PATHNAME)
		}
	}, [waitingUserData, userId, pathname])
}
