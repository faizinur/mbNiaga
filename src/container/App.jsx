import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {
	App,
	Views,
	View,
	Popup,
} from 'framework7-react';
import cordovaApp from '../js/cordova-app';
import router from '../config/router';
import { Provider } from 'react-redux'
import { store, stateKernel } from '../config/redux/store';
import { connect } from 'react-redux';

import { log, ClockTick , Connection} from '../utils/';
import { navigate, setUser } from '../config/redux/actions/';
import { CustomToolbar, SplashScreen } from '../components/molecules/';
import { Idle } from '../container/pages/'
// import IdleTimer from 'react-idle-timer';


let INTERVAL_LENGTH = 1000;
let INTERVAL_ID = 0;
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
			realApp: false,
			idleCounter: 0,
			idleTime: 2,
			popUpStateIdle: false,
		}
	}
	componentDidMount() {
		this.$f7ready((f7) => {
			// Init cordova APIs (see cordova-app.js)
			if (Device.cordova) {
				cordovaApp.init(f7);
			}
			document.addEventListener("click", () => {
				this.setState({ idleCounter: 0 });
			});
			// Call F7 APIs here
		});
		INTERVAL_ID = setInterval(() => {

			if (Object.keys(this.props.profile).length > 1) {
				//idle counter kalo udah login 
				if (this.props.profile.is_login == true && this.state.popUpStateIdle == false) {
					// log('itung timer idle', JSON.stringify(this.props.profile.is_login));
					this.setState({
						idleCounter: this.state.idleCounter + 1,
						popUpStateIdle: this.state.idleCounter > this.state.idleTime ? true : false,
					});
				}
				//jam
				this.props.setUser({
					...this.props.profile,
					...{
						mobileTime: ClockTick(this.props.profile.mobileTime),
						jam_server: ClockTick(this.props.profile.jam_server),
					}
				});
			}
		}, INTERVAL_LENGTH);
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
				<SplashScreen
					onFinish={(e) =>
						this.setState({
							realApp: e.realApp,
						})
					}
				/>
			)
		} else {
			return (
				<App params={this.state.f7params} >
					<CustomToolbar
						shown={shownToolbar}
					/>
					{/* SHOWN : { JSON.stringify(shownToolbar)} PIN {JSON.stringify(this.props.pin)} LOGGED { JSON.stringify(this.props.profile.is_login) }  */}
					<Popup
						className="idle-popup"
						opened={this.state.popUpStateIdle}
						onPopupClosed={() => log('pop up Closed')}
					>
						<Idle
							onFinish={(result) => { this.setState({ popUpStateIdle: false, idleCounter: 0 }) }}
							Connection = {Connection()}
						/>
					</Popup>
					<Views className="safe-areas">
						<View main url={realApp ? '/' : '/Main/'} />
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
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
