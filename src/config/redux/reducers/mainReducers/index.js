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
        available: null,
        platform: '',
        version: 0,
        uuid : '',
        cordova:'',
        model:'',
        manufacturer:'',
        isVirtual: null,
        serial : '',
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