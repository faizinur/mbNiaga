import {
    SET_USER,
    SET_DETAIL_CUSTOMER,
    SET_ACTIVITY_HISTORY,
    SET_PAYMENT_HISTORY,
    SET_PIN
} from '../../actions/types'

const initialState = {
    profile: {
        is_login : false,
    },
    detailCust: [],
    activityHistory: [],
    paymentHistory: [],
    pin : '',
};
import { log } from '../../../../utils/';

const userReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            // log('SET USER : ', action.payload)
            return {
                ...state,
                profile: action.payload,
            }
        case SET_DETAIL_CUSTOMER:
            // log('SET DETAIL CUST : ', action.payload)
            return {
                ...state,
                detailCust: action.payload,
            }
        case SET_ACTIVITY_HISTORY:
            // log('SET ACTIVITY HISTORY : ', action.payload)
            return {
                ...state,
                activityHistory: action.payload,
            }
        case SET_PAYMENT_HISTORY:
            // log('SET PAYMENT HISTORY : ', action.payload)
            return {
                ...state,
                paymentHistory: action.payload,
            }
        case SET_PIN:
            // log('SET PAYMENT HISTORY : ', action.payload)
            return {
                ...state,
                pin: action.payload,
            }
        default:
            return state;
    }
};

export default userReducers;