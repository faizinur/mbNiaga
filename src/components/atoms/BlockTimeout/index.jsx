import React, { useEffect, useState } from 'react';
import { f7 } from 'framework7-react';
import { log } from '../../../utils/';
import { Toast } from '../../atoms';
import { useDispatch, useSelector } from "react-redux";
const BlockTimeout = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE BlockTimeout');
        if (props.display == true) {
            Toast(`Beda Jam Mobile dan Server lebih dari ${maxBedaJam / 60} menit`, 4000).open()
        }
        return () => {
            log('UNMOUNT BlockTimeout');
        }
    }, [])
    let bedaJam = useSelector(state => state.reference.bedaJam);
    let maxBedaJam = useSelector(state => state.reference.maxBedaJam);
    return (
        <div
            onClick={() => { 
                Toast(`Beda Jam Mobile dan Server lebih dari ${maxBedaJam / 60} menit`, 4000).open();
                // alert(`MAKSIMAL BEDA JAM: ${maxBedaJam} \n HASIL date_diff() di PHP : ${bedaJam} \n (semua dalam satuan detik)`)
            }}
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
