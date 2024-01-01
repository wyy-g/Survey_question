import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/user/Login'
import Register from '../pages/user/Register'
import ManageLayout from '../layouts/ManageLayout'
import List from '../pages/manage/List'
import Star from '../pages/manage/Star'
import Trash from '../pages/manage/Trash'
import QuestionLayout from '../layouts/QuestionLayout'
import Edit from '../pages/question/Edit'
import Stat from '../pages/question/Stat'
import NotFound from '../pages/404'
import LoginLayout from '../layouts/LoginLayout'

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
				path: 'stat/:id',
				element: <Stat />,
			},
		],
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
