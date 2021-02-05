import React from 'react';
import { f7 } from 'framework7-react';
const BlockTimeout = (props) => {
    return (
        <div
            onClick={() => { return false }}//f7.dialog.alert('waktu server dan mobile lebih dari 5 menit')}
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
