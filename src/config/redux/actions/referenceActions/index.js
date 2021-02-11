import {
	SET_CONTACT_MODE,
	SET_CONTACT_PERSON,
	SET_PLACE_CONTACTED,
	SET_CALL_RESULT,
	SET_REFRESH_COORDINATE,
	SET_IDLE_TIME,
	SET_BEDA_JAM,
	SET_MAX_BEDA_JAM,
	SET_MOUNT_POINT,
} from '../types'


const setContactMode = (data) => ({
	type: SET_CONTACT_MODE,
	payload: data
});
const setContactPerson = (data) => ({
	type: SET_CONTACT_PERSON,
	payload: data
});
const setPlaceContacted = (data) => ({
	type: SET_PLACE_CONTACTED,
	payload: data
});
const setCallResult = (data) => ({
	type: SET_CALL_RESULT,
	payload: data
});
const setRefreshCoordinate = (data) => ({
	type: SET_REFRESH_COORDINATE,
	payload: data
});
const setIdleTime = (data) => ({
	type: SET_IDLE_TIME,
	payload: data
});
const setBedaJam = (data) => ({
	type: SET_BEDA_JAM,
	payload: data
});
const setMaxBedaJam = (data) => ({
	type: SET_MAX_BEDA_JAM,
	payload: data
});
const setMountPoint = (data) => ({
	type: SET_MOUNT_POINT,
	payload: data
});

export {
	setContactMode,
	setContactPerson,
	setPlaceContacted,
	setCallResult,
	setRefreshCoordinate,
	setIdleTime,
	setBedaJam,
	setMaxBedaJam,
	setMountPoint,
}
