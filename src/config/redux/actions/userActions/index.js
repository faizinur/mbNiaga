import {
    SET_USER,
    SET_DETAIL_CUSTOMER,
    SET_ACTIVITY_HISTORY,
    SET_PAYMENT_HISTORY,
    SET_PIN,
} from '../types'


const setUser = (data) => ({
    type: SET_USER,
    payload: data
});
const setDetailCustomer = (data) => ({
    type: SET_DETAIL_CUSTOMER,
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
const setPin = (data) => ({
    type: SET_PIN,
    payload: data
});

export {
    setUser,
    setDetailCustomer,
    setActivityHistory,
    setPaymetHistory,
    setPin,
}
