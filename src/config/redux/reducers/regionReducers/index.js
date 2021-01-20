import {
    SET_PROVINCE,
    SET_REGENCY,
    SET_DISTRICT,
    SET_SUBDISTRICT,
} from '../../actions/types'

const initialState = {
    province: [],
    regency: [],
    district: [],
    subDistrict: [],
};
import { log } from '../../../../utils/';

const regionReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROVINCE:
            // log('UPDATE PROVINCE : ')
            return {
                ...state,
                province: action.payload,
            }
        case SET_REGENCY:
            // log('UPDATE REGENCY : ')
            return {
                ...state,
                regency: action.payload,
            }
        case SET_DISTRICT:
            // log('UPDATE DISTRICT : ')
            return {
                ...state,
                district: action.payload,
            }
        case SET_SUBDISTRICT:
            // log('UPDATE SUBDISTRICT : ')
            return {
                ...state,
                subDistrict: action.payload,
            }
        default:
            return state;
    }
};

export default regionReducers;