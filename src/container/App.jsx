import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {
	App,
	Views,
	View,
	Popup,
	f7,
} from 'framework7-react';
import cordovaApp from '../js/cordova-app';
import router from '../config/router';
import { Provider } from 'react-redux'
import { store, stateKernel } from '../config/redux/store';
import { connect } from 'react-redux';

import { log, ClockTick, Connection, Geolocation, SQLite, SQLiteTypes } from '../utils/';
import { navigate, setUser, setGeolocation } from '../config/redux/actions/';
import { CustomToolbar, SplashScreen } from '../components/molecules/';
import { CustomStatusBar, BlockTimeout } from '../components/atoms';
import { Idle } from '../container/pages/';

const { GEOLOCATION } = SQLiteTypes;
let INTERVAL_LENGTH = 1000;
let INTERVAL_ID = 0;
let idleTime = 60;
let idleTimeGeo = 0;
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
					androidOverlaysWebView: true,
				},
			},
			realApp: false,
			idleCounter: 0,
			popUpStateIdle: false,
			mountPoint: '/',
			blockTimeout: false,
		}
	}
	componentDidMount() {
		this.$f7ready((f7) => {
			// Init cordova APIs (see cordova-app.js)
			if (Device.cordova) {
				cordovaApp.init(f7);
				document.addEventListener('deviceready', () => {
					if (JSON.stringify(cordova.plugins.uid) == '{}') {
						// alert(`cordova.plugins : ${JSON.stringify(cordova.plugins)}`);
					}
					document.addEventListener("pause", () => {
						// if (this.props.pin != "" && this.props.profile.is_login == true) {
						// 	if ((this.state.idleCounter % idleTime) == 0 && this.state.popUpStateIdle  == false){
						// 		this.setState({ popUpStateIdle: true });
						// 	}
						// }
					}, false);
					// document.addEventListener("resume", () => { log('resume') }, false);
					if (cordova.platformId == 'android') {
						StatusBar.overlaysWebView(true);
						StatusBar.styleLightContent();
					}
				}, false);
			}
			document.addEventListener("click", (e) => {
				if (this.state.popUpStateIdle == false) {
					this.setState({ idleCounter: 0 });
				}
			});
			document.addEventListener("touchmove", () => {
				if (this.state.popUpStateIdle == false) {
					this.setState({ idleCounter: 0 });
				}
			});
			// Call F7 APIs here
		});
		this._getGeo();
		INTERVAL_ID = setInterval(() => {
			if (Object.keys(this.props.profile).length > 1) {
				//jam
				this.props.setUser({
					...this.props.profile,
					...{
						mobileTime: ClockTick(this.props.profile.mobileTime),
						jam_server: ClockTick(this.props.profile.jam_server),
					}
				});
			}
			//idle counter kalo udah login
			this.setState({ idleCounter: this.state.idleCounter + 1 });
			if (this.props.pin != "" && this.props.profile.is_login == true) {
				let pageCurrentName = document.getElementsByClassName('page-current').length > 0 ? document.getElementsByClassName('page-current')[0].dataset.name : undefined;
				if ((this.state.idleCounter % idleTime) == 0 && this.state.popUpStateIdle == false && pageCurrentName != 'Login') {
					this.setState({ popUpStateIdle: true });
				}
			}

			//geolocation
			if (this.state.idleCounter % idleTimeGeo == 0) {
				this._getGeo();
			}

		}, INTERVAL_LENGTH);
	}
	_getGeo = () => {
		Geolocation.currentLocation()
			.then(res => {
				if (res.longitude != 0 && res.latitude != 0) {
					SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [GEOLOCATION, res])
						.then(dbRes => this.props.setGeolocation(res))
						.catch(err => log(err))
				}
			})
			.catch(err => {
				if (err != "") log('error : ' + JSON.stringify(err));
			})
	}
	componentWillUnmount() {
		log('CLEAR INTERVAL')
		clearInterval(INTERVAL_ID);
	}
	render() {
		const { realApp } = this.state;
		let shownToolbar = (Object.keys(this.props.profile).length > 0 && this.props.profile.is_login == true) ? true : false;
		// log('shownToolbar', shownToolbar);
		if (!realApp) {
			return (
				<App params={this.state.f7params}>
					<SplashScreen
						onFinish={(e) => {
							this.setState({
								realApp: e.realApp,
								idleTime: e.idleTime,
								mountPoint: e.mount_point,
							});
							idleTimeGeo = e.refesh_coordinate;
							idleTime = e.idle_time;
							// e.beda_jam;
							if (!(!Device.android && !Device.ios)) {
								if (e.beda_jam > 300) {
									// this.setState({ blockTimeout: true });
								} else {
									// this.setState({ blockTimeout: false });
								}
							}
						}}
					/>
				</App>
			)
		} else {
			return (
				<App params={this.state.f7params}>
					<BlockTimeout display={this.state.blockTimeout} />
					<CustomStatusBar />
					<CustomToolbar
						shown={shownToolbar}
					/>
					{/* SHOWN : { JSON.stringify(shownToolbar)} PIN {JSON.stringify(this.props.pin)} LOGGED { JSON.stringify(this.props.profile.is_login)} */}
					<Popup
						className="idle-popup"
						opened={this.state.popUpStateIdle}
						onPopupClosed={() => log('pop up Closed')}
					>
						<Idle
							onLogin={(result) => {
								if (result != false) {
									this.setState({ popUpStateIdle: false, idleCounter: 0 })
								}
							}}
							onExit={(result) => {
								if (result != false) {
									this.setState({ popUpStateIdle: false, idleCounter: 0 })
								}
							}}
							Connection={Connection()}
						/>
					</Popup>
					<Views className="safe-areas">
						<View main url={'/'} />
					</Views>
				</ App >
			)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
		pin: state.user.pin,
		geo: state.main.geolocation,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (data) => dispatch(setUser(data)),
		navigate: (nav) => dispatch(navigate(nav)),
		setGeolocation: (data) => dispatch(setGeolocation(data))
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
