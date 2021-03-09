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
	AddUser,
	ApprovalSetupArea,
	SetupBucket,
	AddBucket,
	ApprovalSetupBucket,
	SetupParameterCollection,
	ApprovalSetupParamCol,
	ApprovalSetupParameter,
	UploadMasterProvinsi,
	ApprovalUploadDataProvinsi,
	SetupParameter,
	AddParameterMetodeKontak,
	RencanaKunjungan,
	VisitedList,
	RekapTertunda,
	PaidList,
	DetailDebitur,
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
		path: '/Login/',
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
		path: '/UserManagement/',
		component: UserManagement,
	},
	{
		path: '/AddUser/',
		component: AddUser,
	},
	{
		path: '/ApprovalSetupArea/',
		component: ApprovalSetupArea,
	},
	{
		path: '/SetupBucket/',
		component: SetupBucket,
	},
	{
		path: '/AddBucket/',
		component: AddBucket,
	},
	{
		path: '/ApprovalSetupBucket/',
		component: ApprovalSetupBucket,
	},
	{
		path: '/SetupParameterCollection/',
		component: SetupParameterCollection,
	},
	{
		path: '/ApprovalSetupParamCol/',
		component: ApprovalSetupParamCol,
	},
	{
		path: '/ApprovalSetupParameter/',
		component: ApprovalSetupParameter,
	},
	{
		path: '/UploadMasterProvinsi/',
		component: UploadMasterProvinsi,
	},
	{
		path: '/ApprovalUploadDataProvinsi/',
		component: ApprovalUploadDataProvinsi,
	},
	{
		path: '/SetupParameter/',
		component: SetupParameter,
	},
	{
		path: '/AddParameterMetodeKontak/',
		component: AddParameterMetodeKontak,
	},
	{
		path: '/HomeTemplates/',
		component: HomeTemplates,
	},
	{
		path: '/RencanaKunjungan/',
		component: RencanaKunjungan,
	},
	{
		path: '/VisitedList/',
		component: VisitedList,
	},
	{
		path: '/RekapTertunda/',
		component: RekapTertunda,
	},
	{
		path: '/PaidList/',
		component: PaidList,
	},
	{
		path: '/DetailDebitur/',
		component: DetailDebitur,
	},
	{
		path: '(.*)',
		component: NotFound,
	},
];

export default router;