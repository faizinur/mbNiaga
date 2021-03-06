import { goBack, navigateTo, showAlert } from 'framework7-redux';

import {
	SET_DEVICE,
	UPDATE_USER,
	SET_GEOLOCATION,
	SET_GEOLOCATION_IDLE,
	SET_BAHASA,
} from '../types'


const updateUser = (data) => ({
	type: UPDATE_USER,
	payload: data
});
const setDevice = (data) => ({
	type: SET_DEVICE,
	payload: data
});
const setGeolocation = (data) => ({
	type: SET_GEOLOCATION,
	payload: data
});
const setBahasa = (data) => ({
	type: SET_BAHASA,
	payload: data
});


const login = (pageName) => {
	return (dispatch, getState) => {
		// if (loginValid(getState())) {
		//   dispatch(closeLogin());
		// } else {
		//   dispatch(showAlert('Incorrect password! Hint: please enter "password!".', 'Failed Login'));
		// }
		dispatch(navigateTo(`/request-and-load/user/${getState().main.user.username}/`));
		// dispatch(goBack());
	};
};

export {
	updateUser,
	login,
	setDevice,
	setGeolocation,
	setBahasa,
}
