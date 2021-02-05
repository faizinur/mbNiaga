import React, { useEffect, useState } from 'react';
import { f7 } from 'framework7-react';
import { log } from '../../../utils/';
import { Toast } from '../../atoms';
const BlockTimeout = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE BlockTimeout');
        Toast('Jam Mobile dan Server lebih dari 5 menit', 4000).open()
        return () => {
            log('UNMOUNT BlockTimeout');
        }
    }, [])
    return (
        <div
            onClick={() => { Toast('Jam Mobile dan Server lebih dari 5 menit', 4000).open() }}//f7.dialog.alert('waktu server dan mobile lebih dari 5 menit')}
            style={{
                position: 'absolute',
                zIndex: 99999,
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                display: props.display == true ? 'block' : 'none',
                backgroundColor: 'transparent',
            }}
        />
    )
}
export default BlockTimeout;
