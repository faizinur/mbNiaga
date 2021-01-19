import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {
	App,
	Views,
	View,
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

import { log } from '../utils/';
import { updateUser, setUser, navigate } from '../config/redux/actions/';
import { CustomToolbar } from '../components/molecules/';

class Root extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// Framework7 Parameters
			f7params: {
				id: 'io.framework7.myapp', // App bundle ID
				name: 'Mobile Collection Niaga', // App name
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
		log(this);
		this.$f7ready((f7) => {
			// Init cordova APIs (see cordova-app.js)
			if (Device.cordova) {
				cordovaApp.init(f7);
			}
			// Call F7 APIs here
		});
		Promise.all([
			this._getRegion()
		]);
	}
	_getRegion = () => {
		Promise.all([
			this.props.setProvince(region.filter(item => { return item.level == 0 })),
			this.props.setRegency(region.filter(item => { return item.level == 1 })),
			this.props.setDistrict(region.filter(item => { return item.level == 2 })),
			this.props.setSubDistrict(region.filter(item => { return item.level == 3 })),
		]);
	}
	render() {
		return (
			<App params={this.state.f7params} >
				<CustomToolbar
					shown={JSON.stringify(this.props.profile) === '{}'}
				/>
				<Views className="safe-areas">
					<View main url="/" />
				</Views>
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
		navigate: (nav) => dispatch(navigate(nav)),
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
