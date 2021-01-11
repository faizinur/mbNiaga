import {
    SET_USER,
} from '../../actions/types'

const initialState = {
    profile : {

    },
};
import { log } from '../../../../utils/';

const userReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            log('SET USER : ', action.payload)
            return {
                ...state,
                profile: action.payload,
            }
        default:
            return state;
    }
};

export default userReducers;