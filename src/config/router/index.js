import {
	NotFound,
	Home,
	RequestAndLoad,
	Setting,
	Select,
	Login,
} from '../../container/pages';


import {
	mwRequestAndLoad
} from '../middleware/'

var router = [
	{
		path: '/',
		// component: Home,
		component: Login,
	},
	{
		path: '/home/',
		component: Home,
	},
	{
		path: '/request-and-load/user/:userId/',
		async: function (routeTo, routeFrom, resolve, reject) { mwRequestAndLoad(routeTo, routeFrom, resolve, reject, RequestAndLoad) },
	},
	{
		path : '/setting/',
		component : Setting,
	},
	{
		path : '/select/',
		component : Select,
	},
	{
		path: '(.*)',
		component: NotFound,
	},
];

export default router;