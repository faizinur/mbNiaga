import {
    SET_USER,
    SET_DETAIL_CUST,
    SET_ACTIVITY_HISTORY,
    SET_PAYMENT_HISTORY,
} from '../types'


const setUser = (data) => ({
    type: SET_USER,
    payload: data
});
const setDeatilCust = (data) => ({
    type: SET_DETAIL_CUST,
    payload: data
});
const setActivityHistory = (data) => ({
    type: SET_ACTIVITY_HISTORY,
    payload: data
});
const setPaymetHistory = (data) => ({
    type: SET_PAYMENT_HISTORY,
    payload: data
});

export {
    setUser,
    setDeatilCust,
    setActivityHistory,
    setPaymetHistory,
}
