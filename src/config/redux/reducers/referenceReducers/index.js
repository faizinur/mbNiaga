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
} from '../../actions/types'

const initialState = {
    contactMode: [],
    contactPerson: [],
    placeContacted: [],
    callResult: [],
    refeshCoordinate: 60,
    idleTime: 60,
    bedaJam: 0,
    maxBedaJam: 900,
    mountPoint : '/',
};

const referenceReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_CONTACT_MODE:
            return {
                ...state,
                contactMode: action.payload,
            }
        case SET_CONTACT_PERSON:
            return {
                ...state,
                contactPerson: action.payload,
            }
        case SET_PLACE_CONTACTED:
            return {
                ...state,
                placeContacted: action.payload,
            }
        case SET_CALL_RESULT:
            return {
                ...state,
                callResult: action.payload,
            }
        case SET_REFRESH_COORDINATE:
            return {
                ...state,
                refeshCoordinate: action.payload,
            }
        case SET_IDLE_TIME:
            return {
                ...state,
                idleTime: action.payload,
            }
        case SET_BEDA_JAM:
            return {
                ...state,
                bedaJam: action.payload,
            }
        case SET_MAX_BEDA_JAM:
            return {
                ...state,
                maxBedaJam: action.payload,
            }
        case SET_MOUNT_POINT:
            return {
                ...state,
                mountPoint: action.payload,
            }
        default:
            return state;
    }
};

export default referenceReducers;