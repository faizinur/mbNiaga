import {
    SET_DEVICE,
    UPDATE_USER,
} from '../../actions/types'

const initialState = {
    user: {
        username: '',
        password: '',
    },
    device: {
        available: true,
        platform: 'Android',
        version: 10,
        uuid : '1bb9c549939b1b1e',
        cordova:'9.0.0',
        model:'Android SDK built for x86',
        manufacturer:'Google',
        isVirtual: true,
        serial : 'unknown'
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
                    device : action.payload,
                }
        default:
            return state;
    }
};

export default mainReducers;