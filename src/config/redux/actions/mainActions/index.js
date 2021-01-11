import { goBack, navigateTo, showAlert } from 'framework7-redux';

import {
	UPDATE_USER,
} from '../types'


const updateUser = (data) => ({
	type: UPDATE_USER,
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
}
