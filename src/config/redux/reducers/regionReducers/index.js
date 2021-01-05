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

const regionReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROVINCE:
            console.log('UPDATE PROVINCE : ')
            return {
                ...state,
                province: action.payload,
            }
        case SET_REGENCY:
            console.log('UPDATE REGENCY : ')
            return {
                ...state,
                regency: action.payload,
            }
        case SET_DISTRICT:
            console.log('UPDATE DISTRICT : ')
            return {
                ...state,
                district: action.payload,
            }
        case SET_SUBDISTRICT:
            console.log('UPDATE SUBDISTRICT : ')
            return {
                ...state,
                subDistrict: action.payload,
            }
        default:
            return state;
    }
};

export default regionReducers;