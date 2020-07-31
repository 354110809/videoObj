// import Vue from 'vue'
// import Router from 'vue-router'

// Vue.use(Router)
let title = '马士兵老师的视频官方网站';
let keywords = '马士兵,马士兵教育,java架构师培训,架构师培训,架构师培训课程,架构师培训课程,架构师培训班,人工智能培训,人工智能培训课程,人工智能培训机构,人工智能培训班,大数据培训,软件测试培训,区块链培训,架构师培训机构,大数据培训机构,软件测试培训机构,区块链培训机构,Web前端培训,Web前端培训课程,Web前端培训机构,Web前端培训班';
let description = '马士兵老师的官方网站，由马士兵老师携手BATJ名师为大家提供java架构师培训,人工智能培训,大数据培训,软件测试培训,Web前端培训,区块链培训等课程，课程均由一线互联网公司技术大牛精心研发，全程项目驱动知识的学习，让您站在巨人的肩膀上快速成长。马士兵教育：成就更好的自己。';

export default new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
		path: '/',
		name: 'videoHome',
		meta: {
			name:'视频首页',
			title: title,
			keywords: keywords,
			description: description,
			head: false
		},
		component: () => import('@/views/videoPage/videoHome/index.vue')
	},{
		path: '/allCourses',
		name: 'allCourses',
		meta: {
			name:'所有课程',
			title: title,
			keywords: keywords,
			description: description,
			head: true
		},
		component: () => import('@/views/videoPage/allCourses/index.vue')
	},{
		path: '/details/:id',
		name: 'details',
		meta: {
			name:'课程详情',
			title: title,
			keywords: keywords,
			description: description,
			head: true
		},
		component: () => import('@/views/videoPage/courseDetails/index.vue')
	},{
		path: '/studyPlay/:id/:name',
		name: 'studyPlay',
		meta: {
			name:'视频学习',
			title: title,
			keywords: keywords,
			description: description,
			head: true
		},
		component: () => import('@/views/videoPage/studyPlay/index.vue')
	},{
		path: '/myCourse',
		name: 'myCourse',
		meta: {
			name:'我的学习',
			title: title,
			keywords: keywords,
			description: description,
			head: true
		},
		component: () => import('@/views/videoPage/myCourse/index.vue')
	},{
		path: '/ProblemFeedback',
		name: 'ProblemFeedback',
		meta: {
			name:'问题反馈',
			title: title,
			keywords: keywords,
			description: description,
			head: true
		},
		component: () => import('@/views/videoPage/ProblemFeedback/index.vue')
	},
	{ path: '*', redirect: '/' }],
	// 滚动行为
	scrollBehavior (to, from, savedPosition) {
		// return 期望滚动到哪个的位置
		return { x: 0, y: 0 };
	}
})