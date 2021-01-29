import {
    SET_CONTACT_MODE,
    SET_CONTACT_PERSON,
    SET_PLACE_CONTACTED,
    SET_CALL_RESULT,
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

export {
    setContactMode,
    setContactPerson,
    setPlaceContacted,
    setCallResult,
}
