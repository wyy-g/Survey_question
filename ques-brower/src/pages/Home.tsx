import React, { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.scss'
import { Button, Space, Carousel } from 'antd'
import img1 from '../assets/lunbo/1.png'
import img2 from '../assets/lunbo/2.png'
import img3 from '../assets/lunbo/3.png'
import img4 from '../assets/lunbo/4.png'

const Home: FC = () => {
	const nav = useNavigate()
	const contentStyle: React.CSSProperties = {
		height: '320px',
		color: '#fff',
		lineHeight: '160px',
		textAlign: 'center',
		background: '#364d79',
		width: '616px',
	}
	return (
		<div className={styles['home-wrapper']}>
			<div className={styles.left}>
				<Carousel autoplay>
					<div className={styles['img-style']}>
						<img src={img1} alt="" />
					</div>
					<div className={styles['img-style']}>
						<img src={img2} alt="" />
					</div>
					<div className={styles['img-style']}>
						<img src={img3} alt="" />
					</div>
					<div className={styles['img-style']}>
						<img src={img4} alt="" />
					</div>
				</Carousel>
			</div>
			<div className={styles.right}>
				<div className={styles.head}>
					<h1 style={{ fontSize: '44px' }}>问卷调查&nbsp;&nbsp;为您定制</h1>
					<span style={{ fontSize: '18px', marginTop: '12px' }}>专属的调研系统</span>
				</div>
				<div>
					<Space>
						<Button
							type="primary"
							style={{
								width: '200px',
								height: '60px',
								fontSize: '22px',
								borderRadius: '15px',
								marginRight: '5px',
							}}
							onClick={() => nav('/user/login')}
						>
							免费使用
						</Button>
						<Button
							type="primary"
							style={{ width: '200px', height: '60px', fontSize: '22px', borderRadius: '15px' }}
							onClick={() => nav('/user/login')}
						>
							AI 创作
						</Button>
					</Space>
				</div>
				<span style={{ position: 'absolute', right: '50px', bottom: '30px' }}>
					备案号：
					<Button type="link" onClick={() => window.open('https://beian.miit.gov.cn ')}>
						冀ICP备2024057819号
					</Button>
				</span>
			</div>
		</div>
	)
}

export default Home
