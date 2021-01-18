import React from 'react';
import PropTypes from 'prop-types'
import { log } from '../../../utils';

const DefaultNavbar = (props) => {
    return (
        <div style={styles.container}>
            <p style={styles.title}>{'title' in props ? props.title : 'null'}</p>
            <p style={styles.info}>{'network' in props ? props.network : 'null'}</p>
        </div>
    )
}

DefaultNavbar.propTypes = {
    title: PropTypes.string,
    network: PropTypes.string,
};

const styles = {
    container: {
        display: 'flex',
        height: 58,
        backgroundColor: "#c0392b",
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'initial',
        color: '#fcf5f4',
        lineHeight: 16
    },
    info : {
        fontSize: 12,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};

export default DefaultNavbar;