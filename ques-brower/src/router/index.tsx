import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/user/Login'
import Register from '../pages/user/Register'
import Profile from '../pages/user/Profile'
import ManageLayout from '../layouts/ManageLayout'
import List from '../pages/manage/List'
import Star from '../pages/manage/Star'
import Trash from '../pages/manage/Trash'
import QuestionLayout from '../layouts/QuestionLayout'
import Edit from '../pages/question/Edit'
import Publish from '../pages/question/Publish'
import Stat from '../pages/question/Stat'
import NotFound from '../pages/404'
import LoginLayout from '../layouts/LoginLayout'
import Report from '../pages/question/Stat/report'
import AnswerQues from '../pages/answerQues'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: 'manage',
				element: <ManageLayout />,
				children: [
					{
						path: 'list',
						element: <List />,
					},
					{
						path: 'star',
						element: <Star />,
					},
					{
						path: 'trash',
						element: <Trash />,
					},
				],
			},
			{
				path: 'profile',
				element: <Profile />,
			},
		],
	},
	{
		path: '/user',
		element: <LoginLayout />,
		children: [
			{
				path: '/user/login',
				element: <Login />,
			},
			{
				path: '/user/register',
				element: <Register />,
			},
		],
	},

	{
		path: 'question',
		element: <QuestionLayout />,
		children: [
			{
				path: 'edit/:id',
				element: <Edit />,
			},
			{
				path: 'publish/:id',
				element: <Publish />,
			},
			{
				path: 'stat/:id',
				element: <Stat />,
				children: [
					{
						path: 'report',
						element: <Report />,
					},
				],
			},
		],
	},
	{
		path: 'question/:id',
		element: <AnswerQues />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
])

export default router

// 常用的路由，变量
export const HOME_PATHNAME = '/'
export const LOGIN_PATHNAME = '/user/login'
export const REGISTER_PATHNAME = '/user/register'
export const MANAGE_INDEX_PATHNAME = '/manage/list'
