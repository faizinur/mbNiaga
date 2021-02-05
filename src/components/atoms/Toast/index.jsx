import React from 'react';
import { f7 } from 'framework7-react';
import { log } from '../../../utils/';
const Toast = (...props) => {
    return f7.toast.create({
        text: props[0] ? props[0] : '',
        closeTimeout: props[1] ? props[1] : 4000,
        closeButton: false,
    })
}
export default Toast;
