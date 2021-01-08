import {
    SET_USER,
} from '../../actions/types'

const initialState = {
    profile : {

    },
};

const userReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            console.log('SET USER : ')
            return {
                ...state,
                profile: action.payload,
            }
        default:
            return state;
    }
};

export default userReducers;