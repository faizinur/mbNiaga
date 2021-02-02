import React from 'react';
import PropTypes from 'prop-types'
import { log } from '../../../utils';
import { Icon } from 'framework7-react';

const DefaultNavbar = (props) => {
    // if('mode' in props){

    // }    
    switch (props.mode) {
        case 'info':
            return (
                <div style={
                    {
                        ...info.container,
                        ...{
                            justifyContent: 'network' in props ? 'space-between' : 'flex-start'
                        }
                    }
                }>
                    <div
                        style={info.iconContainer}
                        onClick={(e) => 'backLink' in props ? props.backLink(e) : e.preventDefault()}>
                        <Icon style={info.icon} ios="f7:arrow_left" aurora="f7:arrow_left" md="material:arrow_back"></Icon>
                        <p style={info.title}>{'title' in props ? props.title : ''}</p>
                    </div>
                    {
                        'network' in props ?
                            <div>
                                <p style={info.network}>{props.network}</p>
                            </div>
                            : ''
                    }
                </div>
            )
        default:
            return (
                <div style={dashboard.container}>
                    <p style={dashboard.title}>{'title' in props ? props.title : ''}</p>
                    <p style={dashboard.network}>{'network' in props ? props.network : ''}</p>
                </div>
            )
    }
}

DefaultNavbar.propTypes = {
    title: PropTypes.string,
    network: PropTypes.string,
};

const dashboard = {
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
    network: {
        fontSize: 12,
        fontWeight: 'initial',
        color: '#fcf5f4',
    }
};

const info = {
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