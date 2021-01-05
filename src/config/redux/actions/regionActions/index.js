import { goBack, navigateTo, showAlert } from 'framework7-redux';

import {
    SET_PROVINCE,
    SET_REGENCY,
    SET_DISTRICT,
    SET_SUBDISTRICT,
} from '../types'


const setProvince = (data) => ({
  type: SET_PROVINCE,
  payload: data
});
const setRegency = (data) => ({
  type: SET_REGENCY,
  payload: data
});
const setDistrict = (data) => ({
  type: SET_DISTRICT,
  payload: data
});
const setSubDistrict = (data) => ({
  type: SET_SUBDISTRICT,
  payload: data
});

export {
    setProvince,
    setRegency,
    setDistrict,
    setSubDistrict,
}
