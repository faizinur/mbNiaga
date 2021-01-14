import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {
	App,
	Views,
	View,
	Toolbar,
	Link,
	f7
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
import { log } from '../utils/';
import { updateUser, setUser, navigate } from '../config/redux/actions/';
import { POST } from '../utils/API';

class Root extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// number : 1,
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
			tablinkActive: 0,
		}
	}
	componentDidMount() {
		// log(this.$f7);
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
		// log('export : ', Datastores.exportData());
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
	// _onLogin = () => {
	// 	this.props.updateUser({
	// 		username: 'Jhon Doe',
	// 		password: '1234',
	// 	});
	// }
	_setTabLink = (index) => {
		switch (index) {
			case 0:
				log('CLEAR HISTORY');
				this.setState({ tablinkActive: index });
				break;
			case 1:
				log('CLEAR HISTORY');
				this.setState({ tablinkActive: index });
				break;
			case 2:
				f7.dialog.confirm(
					'text',
					'title',
					() => {
						this.setState({ tablinkActive: 2 }, () => {
							this.props.setUser({});
							this.props.navigate('/');
						});
					},
					() => log('Cancel')
				)
				break;
		}

	}
	render() {
		const { username, password } = this.props.user;
		const { number, tablinkActive } = this.state;
		return (
			<App params={this.state.f7params} >
				<div
					// onClick={(e) => log(e)}
					style={{
						width: '100%',
						height: 56,
						position: 'absolute',
						bottom: 0,
						left: 0,
						zIndex: 9999,
						display: Object.keys(this.props.profile).length === 0 ? 'none' : 'block'
					}}>
					<Toolbar tabbar bottom labels>
						<Link onClick={(e) => this._setTabLink(0)}
							href="/Main/"
							tabLink=''
							text="MENU"
							iconIos="f7:menu"
							iconAurora="f7:menu"
							iconMd="material:menu"
							tabLinkActive={tablinkActive == 0} />
						<Link onClick={(e) => this._setTabLink(1)}
							href="/UpdatePin/"
							tabLink=''
							text="UBAH PIN"
							iconIos="f7:lock"
							iconAurora="f7:lock"
							iconMd="material:lock"
							tabLinkActive={tablinkActive == 1} />
						<Link onClick={(e) => this._setTabLink(2)}
							tabLink=''
							text="KELUAR"
							iconIos="f7:arrow_right_to_line_alt"
							iconAurora="f7:arrow_right_to_line_alt"
							iconMd="material:exit_to_app"
							tabLinkActive={tablinkActive == 2} />
					</Toolbar>
				</div>
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
