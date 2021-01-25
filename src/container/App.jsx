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

import { log, ClockTick } from '../utils/';
import { navigate, setUser } from '../config/redux/actions/';
import { CustomToolbar, SplashScreen } from '../components/molecules/';

let INTERVAL_LENGTH = 2000;
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
		}
	}
	componentDidMount() {
		this.$f7ready((f7) => {
			// Init cordova APIs (see cordova-app.js)
			if (Device.cordova) {
				cordovaApp.init(f7);
			}
			// Call F7 APIs here
		});
		INTERVAL_ID = setInterval(() => {
			if (JSON.stringify(this.props.profile) !== '{}') {
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
		if (!realApp) {
			return (<SplashScreen onFinish={(e) => this.setState({ realApp: !realApp })} />)
		} else {
			return (
				<App params={this.state.f7params} >
					<CustomToolbar
						shown={JSON.stringify(this.props.profile) === '{}'}
					/>
					<Views className="safe-areas">
						<View main url="/" />
					</Views>
				</ App >
			)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.user.profile,
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
