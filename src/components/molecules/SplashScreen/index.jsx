import React, { useEffect, useState } from 'react';
import {
    Page,
    f7,
} from 'framework7-react';
import {
    setProvince,
    setRegency,
    setDistrict,
    setSubDistrict,
} from '../../../config/redux/actions';
import { useDispatch, useSelector } from "react-redux";
import region from '../../../data/region.json';
import { log, SQLite } from '../../../utils/';
import PropTypes from 'prop-types'

let sqlite = new SQLite();
const SplashScreen = (props) => {
    useEffect(() => {
        console.log('MOUNT OR UPDATE SplashScreen');
        Promise.all([
            _getRegion(),
            sqlite.initDB(),
            //.... another promise
        ])
            .then(res => {
                props.onFinish({});
            });
        return () => {
            console.log('UNMOUNT SplashScreen');
        }
    }, [])
    const dispatch = useDispatch();
    const _getRegion = () => {
        Promise.all([
            dispatch(setProvince(region.filter(item => { return item.level == 0 }))),
            dispatch(setRegency(region.filter(item => { return item.level == 1 }))),
            dispatch(setDistrict(region.filter(item => { return item.level == 2 }))),
            dispatch(setSubDistrict(region.filter(item => { return item.level == 3 }))),
        ]);
    }
    return (
        <Page noToolbar noNavbar noSwipeback name="SplashScreen">
            <div style={styles.container}>
                <p style={styles.text}>Mobile Collection Niaga</p>
            </div>
        </Page >
    )
}

SplashScreen.propTypes = {
    onFinish: PropTypes.func,
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {},
    text: {
        color: '#c0392b',
        fontWeight: 'bold',
        fontSize: 16,
    },
}

export default SplashScreen;
