import React, { useEffect } from 'react';
import { log } from '../../../utils';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
const CustomStatusBar = (props) => {
    useEffect(() => {
        // log('MOUNT OR UPDATE CustomStatusBar');
        return () => {
            // log('UNMOUNT CustomStatusBar');
        }
    }, [])
    let color = 'color' in props ? props.color : '#c0392b';
    let height = Device.android ? 24 : (Device.ios ? 24 : 0);
    let display = Device.android ? 'flex' : (Device.ios ? 'flex' : 'none');
    return (
        <div style={{ display: display, flex: 1, backgroundColor: color, height: height }} />
    )
}
export default CustomStatusBar;
