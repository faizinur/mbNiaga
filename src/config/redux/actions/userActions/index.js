import {
    SET_USER,
} from '../types'


const setUser = (data) => ({
    type: SET_USER,
    payload: data
});
export {
    setUser,
}
