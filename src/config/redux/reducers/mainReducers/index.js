import {
    SET_DEVICE,
    UPDATE_USER,
    SET_GEOLOCATION,
} from '../../actions/types'

const initialState = {
    user: {
        username: '',
        password: '',
    },
    device: {
        available: null,
        platform: '',
        version: 0,
        uuid: '',
        cordova: '',
        model: '',
        manufacturer: '',
        isVirtual: null,
        serial: '',
    },
    geolocationIdle : 60,
    geolocation: {
        latitude: 0.0,
        longitude: 0.0,
        altitude: null,
        accuracy: 0,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: 0,
    }
};
import { log } from '../../../../utils/';

const mainReducers = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            log('UPDATE USER : ', action.payload)
            return {
                ...state,
                user: action.payload,
            }
        case SET_DEVICE:
            log('SET DEVICE : ', action.payload);
            return {
                ...state,
                device: action.payload,
            }
        case SET_GEOLOCATION:
            // log('SET GEOLOCATION : ', action.payload);
            return {
                ...state,
                geolocation: action.payload,
            }
        default:
            return state;
    }
};

export default mainReducers;