import {
	NotFound,
	Home,
	Login,
	Check,
	DeviceInfo,
	DaftarPin,
	Main,
	ListDebitur,
	// RequestAndLoad,
	// Setting,
	// Select,
} from '../../container/pages';


import {
	HomeTemplates
} from '../../container/templates';

// import {
// 	mwRequestAndLoad
// } from '../middleware/'

var router = [
	{
		path: '/',
		// component: Home,
		component: Login,
	},
	{
		path: '/Home/',
		component: Home,
	},
	{
		path: '/HomeTemplates/',
		component: HomeTemplates,
	},
	{
		path: '/Check/',
		component: Check,
	},
	{
		path: '/DeviceInfo/',
		component: DeviceInfo,
	},
	{
		path: '/DaftarPin/',
		component: DaftarPin,
	},
	{
		path: '/Main/',
		component: Main,
	},
	{
		path: '/ListDebitur/',
		component: ListDebitur,
	},
	{
		path: '(.*)',
		component: NotFound,
	},
	// {
	// 	path: '/request-and-load/user/:userId/',
	// 	async: function (routeTo, routeFrom, resolve, reject) { mwRequestAndLoad(routeTo, routeFrom, resolve, reject, RequestAndLoad) },
	// },
	// {
	// 	path : '/setting/',
	// 	component : Setting,
	// },
	// {
	// 	path : '/select/',
	// 	component : Select,
	// },
];

export default router;