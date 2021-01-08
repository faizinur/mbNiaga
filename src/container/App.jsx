import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {
	App,
	Views,
	View,
	Toolbar,
	Link,
	Button,
	Page,
	Block,
	Row,
	Col,
} from 'framework7-react';
import cordovaApp from '../js/cordova-app';
import router from '../config/router';
import { Provider } from 'react-redux'
import { store, stateKernel } from '../config/redux/store';
import { connect } from 'react-redux';
import {
	setProvince,
	setRegency,
	setDistrict,
	setSubDistrict,
} from '../config/redux/actions/regionActions';

import region from '../data/region.json';

import Datastores from '../database/';
import { log } from '../utils/consoles/';
import { updateUser, setUser } from '../config/redux/actions/';
import { POST } from '../utils/API';


class Root extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// number : 1,
			// Framework7 Parameters
			f7params: {
				id: 'io.framework7.myapp', // App bundle ID
				name: 'mobCollNiaga', // App name
				theme: 'auto', // Automatic theme detection
				// App root data
				data: function () { return {} },
				// App routes
				routes: router,
				// App Framework7 Redux state kernel
				stateKernel,
				// Input settings
				input: {
					scrollIntoViewOnFocus: Device.cordova && !Device.electron,
					scrollIntoViewCentered: Device.cordova && !Device.electron,
				},
				// Cordova Statusbar settings
				statusbar: {
					iosOverlaysWebView: true,
					androidOverlaysWebView: false,
				},
			},
		}
	}
	componentDidMount() {
		// console.log(this.$f7);
		this.$f7ready((f7) => {
			// Init cordova APIs (see cordova-app.js)
			if (Device.cordova) {
				cordovaApp.init(f7);
			}
			// Call F7 APIs here
		});
		Promise.all([
			this._initDB(),
			this._getRegion(),
			this._callAPI()
		]);
	}

	_initDB = async () => {
		log('export : ', Datastores.exportData());
		// try {
		// const insertResult = await Datastores.insert('collections', { name: 'Ceres', type: 'asteroid' });
		// log('INSERT RESULT : ', insertResult == null ? 'INSERT!': 'UDAH ADA!');
		// 	// const updateResult = await Datastores.update('collections', { name: 'saturnus'}, { name: 'neptunus'});
		// 	// log('UPDATE RESULT : ', updateResult);
		// const deleteResult = await Datastores.delete('collections', {}, true);
		// log('DELETE RESULT : ', deleteResult);
		// 	// const countResult = await Datastores.count('collections');
		// 	// log('COUNT RESULT : ', countResult);
		// const selectResult = await Datastores.select('collections');
		// log('SELECT RESULT : ', selectResult);
		// } catch (e) {
		// 	log(e);
		// }
	}
	_callAPI = () => {
		// var user = {
		// 	nip : 'nip2',
		//     password : '1234',
		// }
		// // POST(`Login`, user)
		// POST(`users`, user, false)
		// 	.then(res => log(res))
		// 	.catch(err => log(err));
	}
	_getRegion = () => {
		Promise.all([
			this.props.setProvince(region.filter(item => { return item.level == 0 })),
			this.props.setRegency(region.filter(item => { return item.level == 1 })),
			this.props.setDistrict(region.filter(item => { return item.level == 2 })),
			this.props.setSubDistrict(region.filter(item => { return item.level == 3 })),
		]);
	}
	_onLogin = () => {
		this.props.updateUser({
			username: 'Jhon Doe',
			password: '1234',
		});
	}
	render() {
		const { username, password } = this.props.user;
		const { number } = this.state;
		return (
			<App params={this.state.f7params} >
				{
					(Object.keys(this.props.profile).length == 0) &&
					<Views className="safe-areas">
						<View main url="/" />
					</Views>
					||
					<Views tabs className="safe-areas">
						<Toolbar tabbar labels bottom>
							<Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" iconAurora="f7:house_fill" iconMd="material:home" text="Home" />
							<Link tabLink="#view-select" iconIos="f7:square_list_fill" iconAurora="f7:square_list_fill" iconMd="material:view_list" text="Select" />
							<Link tabLink="#view-setting" iconIos="f7:gear" iconAurora="f7:gear" iconMd="material:settings" text="Setting" />
						</Toolbar>

						<View id="view-home" main tab tabActive url="/home/" />
						<View id="view-select" name="select" tab url="/select/" />

						<View id="view-setting" name="setting" tab url="/setting/" />
					</Views>
				}
			</App >
		)
	}
}

const mapStateToProps = (state) => {
	return {
		province: state.region.province,
		regency: state.region.regency,
		district: state.region.district,
		subDistrict: state.region.subDistrict,
		user: state.main.user,
		profile: state.user.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setProvince: (data) => dispatch(setProvince(data)),
		setRegency: (data) => dispatch(setRegency(data)),
		setDistrict: (data) => dispatch(setDistrict(data)),
		setSubDistrict: (data) => dispatch(setSubDistrict(data)),
		updateUser: (data) => dispatch(updateUser(data)),
		setUser: (data) => dispatch(setUser(data)),
	};
};

export default () => {
	const RootApp = connect(mapStateToProps, mapDispatchToProps)(Root);
	return (
		<Provider store={store}>
			<RootApp />
		</Provider>
	);
};
