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
		path: '/request-and-load/user/:userId/',
		async: function (routeTo, routeFrom, resolve, reject) { mwRequestAndLoad(routeTo, routeFrom, resolve, reject, RequestAndLoad, this) },
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