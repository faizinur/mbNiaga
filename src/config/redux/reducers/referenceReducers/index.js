import {
    SET_CONTACT_MODE,
    SET_CONTACT_PERSON,
    SET_PLACE_CONTACTED,
    SET_CALL_RESULT,
} from '../../actions/types'

const initialState = {
    contactMode: [],
    contactPerson: [],
    placeContacted: [],
    callResult: [],
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
        default:
            return state;
    }
};

export default referenceReducers;