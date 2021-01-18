import React from 'react';
import PropTypes from 'prop-types'
import { log } from '../../../utils/';

const ListMenu = (props) => {
    return (
        <div
            onClick={(e) => 'onClick' in props ? props.onClick() : {}}
            style={styles.container}>
            <p style={styles.text}>
                {'label' in props ? props.label : 'null'}
            </p>
        </div>
    )
}

ListMenu.propTypes = {
    onClick : PropTypes.func,
    label : PropTypes.string,
};

const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#c0392b',
        height: 32,
        borderRadius: 5,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};

export default ListMenu;