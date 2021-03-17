import React from 'react';
import { f7 } from 'framework7-react';
import { log } from '../../../utils/';
const Toast = (...props) => {
    log(props[0] ? props[0] : '',)
    return f7.toast.create({
        text: props[0] ? props[0] : '',
        closeTimeout: props[1] ? props[1] : 4000,
        closeButton: props[2] ? props[2] :  false,
    })
}
export default Toast;
