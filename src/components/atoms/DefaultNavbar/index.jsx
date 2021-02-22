import React from 'react';
import PropTypes from 'prop-types'
import { log } from '../../../utils';
import { Icon } from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { back } from '../../../config/redux/actions/';
const DefaultNavbar = (props) => {
    // if('mode' in props){

    // }    
    // switch (props.mode) {
    //     case 'info':
    
    const dispatch = useDispatch();
    return (
        <div style={
            {
                ...styles.container,
                ...{
                    justifyContent: 'network' in props ? 'space-between' : 'flex-start'
                }
            }
        }>
            <div
                style={styles.iconContainer} >
                {
                    'backLink' in props ?
                    <div
                    onClick={() => dispatch(back())}
                    >
                        <Icon style={styles.icon} ios="f7:arrow_left" aurora="f7:arrow_left" md="material:arrow_back"></Icon>
                    </div>
                    : <div></div>
                }
                {
                    'title' in props ?
                        <p style={styles.title}>{props.title}</p>
                        : <p></p>
                }
            </div>
            {
                'network' in props ?
                    <div>
                        <p style={styles.network}>{props.network}</p>
                    </div>
                    : ''
            }
        </div >
    )
    //     default:
    //         return (
    //             <div style={dashboard.container}>
    //                 <p style={dashboard.title}>{'title' in props ? props.title : ''}</p>
    //                 <p style={dashboard.network}>{'network' in props ? props.network : ''}</p>
    //             </div>
    //         )
    // }
}

DefaultNavbar.propTypes = {
    title: PropTypes.string,
    network: PropTypes.string,
    backLink: PropTypes.any,
};


const styles = {
    container: {
        display: 'flex',
        height: 58,
        backgroundColor: "#c0392b",
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'initial',
        color: '#fcf5f4',
        lineHeight: 16
    },
    icon: {
        fontSize: 12,
        fontWeight: 'initial',
        color: '#fcf5f4',
        marginRight: 10,
        fontSize: 27,
    },
    iconContainer: {
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    network: {
        fontSize: 12,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};


export default DefaultNavbar;