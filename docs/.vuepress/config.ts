import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
	title: 'wk-libs文档',
	description: '这是我的第一个 VuePress 站点',
	markdown: {
		toc: {
			level: [1, 2, 3, 4]
		},
	},
	theme: defaultTheme({
		locales: {
			'/': {
				// navbar
				navbar: [
					{
						text: 'Date',
						link: '/date/',
					},
					{
						text: 'Scroll',
						link: '/scroll/',
					},
					{
						text: 'Utils',
						link: '/utils/',
					},
				],
				// sidebar
				sidebar: {
					'/date/': [{
						text: '指南',
						children: [
							'/date/index.md',
							'/date/function.md'
						]
					}]
				},
				// page meta
				editLinkText: 'Edit this page on GitHub',
			},
		},
		// 默认主题配置
		navbar: [
			{
				text: '首页',
				link: '/',
			},
		],
	}),
})
