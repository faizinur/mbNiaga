import {
    UPDATE_USER,
} from '../../actions/types'

const initialState = {
    user : {
        username : '',
        password : '',
    },
};
import { log } from '../../../../utils/';

const mainReducers = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER : 
        log('UPDATE USER : ', action.payload)
        return {
            ...state,
            user : action.payload,
        }
        default:
            return state;
    }
};

export default mainReducers;