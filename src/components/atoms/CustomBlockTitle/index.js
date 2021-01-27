import React from 'react';
import PropTypes from 'prop-types'

const CustomBlockTitle = (props) => {
    return (
        <div style={'noGap' in props && 'center' in props ? styles.containerCenterNoGap 
            : 'center' in props ? styles.containerCenter 
            : 'noGap' in props ? styles.containerNoGap
            : styles.container}>
            <p style={styles.title}>{'title' in props ? props.title : ''}</p>
            <p style={styles.info}>{'rightTitle' in props && !('center' in props)? props.rightTitle : ''}</p>
        </div>
    )
}

CustomBlockTitle.propTypes = {
    title: PropTypes.string,
    rightTitle: PropTypes.string,
    noGap: PropTypes.bool,
    center: PropTypes.bool,
};

const styles = {
    container: {
        display: 'flex',
        height: 42,
        backgroundColor: "#c0392b",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginTop: '8px',
        marginBottom: '8px',
        marginRight: '16px',
        marginLeft: '16px',
    },
    containerNoGap: {
        display: 'flex',
        height: 42,
        backgroundColor: "#c0392b",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginTop: '8px',
        marginBottom: '8px',
    },
    containerCenter: {
        display: 'flex',
        height: 42,
        backgroundColor: "#c0392b",
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginTop: '8px',
        marginBottom: '8px',
        marginRight: '16px',
        marginLeft: '16px',
    },
    containerCenterNoGap: {
        display: 'flex',
        height: 42,
        backgroundColor: "#c0392b",
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginTop: '8px',
        marginBottom: '8px',
    },
    title: {
        fontSize: 14,
        fontWeight: 'initial',
        color: '#fcf5f4',
        lineHeight: 16
    },
    info : {
        fontSize: 11,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};

export default CustomBlockTitle;