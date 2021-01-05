import { goBack, navigateTo, showAlert } from 'framework7-redux';

import {
    INCREMENT,
    DECREMENT
} from '../types'


const increment = data => ({
    type: INCREMENT,
    payload: data
});

const decrement = data => ({
    type: DECREMENT,
    payload: data
});


export {
    increment,
    decrement,
}
