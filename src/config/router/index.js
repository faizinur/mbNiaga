import {
	NotFound,
	Home,
	Login,
	Check,
	DeviceInfo,
	DaftarPin,
	Main,
	ListDebitur,
	InfoDebitur,
	AddKunjungan,
	UpdateDebitur,
	RekapTerkirim,
	UpdatePin,
	DetailHasilKunjungan,
	MonitoringDebitur,
	MonitoringPetugas,
	ApplicationLog,
	UserManagement,
} from '../../container/pages';


import {
	HomeTemplates
} from '../../container/templates';

var router = [
	{
		path: '/',
		component: Login,
	},
	{
		path: '/Home/',
		component: Home,
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
		path: '/InfoDebitur/',
		component: InfoDebitur,
	},
	{
		path: '/AddKunjungan/',
		component: AddKunjungan,
	},
	{
		path: '/UpdateDebitur/',
		component: UpdateDebitur,
	},
	{
		path: '/RekapTerkirim/',
		component: RekapTerkirim,
	},
	{
		path: '/UpdatePin/',
		component: UpdatePin,
	},
	{
		path: '/DetailHasilKunjungan/',
		component: DetailHasilKunjungan,
	},
	{
		path: '/MonitoringDebitur/',
		component: MonitoringDebitur,
	},
	{
		path: '/MonitoringPetugas/',
		component: MonitoringPetugas,
	},
	{
		path: '/ApplicationLog/',
		component: ApplicationLog,
	},
	{
		path: '/UserManagement/',
		component: UserManagement,
	},
	{
		path: '/HomeTemplates/',
		component: HomeTemplates,
	},
	{
		path: '(.*)',
		component: NotFound,
	},
];

export default router;