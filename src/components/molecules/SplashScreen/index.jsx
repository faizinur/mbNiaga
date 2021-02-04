import React, { useEffect, useState } from 'react';
import {
    Page,
    f7
} from 'framework7-react';
import {
    setProvince,
    setRegency,
    setDistrict,
    setSubDistrict,
} from '../../../config/redux/actions';
import { useDispatch, useSelector } from "react-redux";
import region from '../../../data/region.json';
import { log, SQLite, SQLiteTypes, Connection, POST, Device } from '../../../utils/';
import PropTypes from 'prop-types';
import { setUser, setDetailCustomer, setActivityHistory, setPaymetHistory, setDevice, setPin, setCallResult, setContactMode, setContactPerson, setPlaceContacted } from '../../../config/redux/actions/';
const { PIN, DEVICE_INFO, LIST_ACCOUNT, DETAIL_COSTUMER, ACTIVITY_HISTORY, PAYMENT_HISTORY, REFERENCE } = SQLiteTypes;
const SplashScreen = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE SplashScreen');
        Promise.all([
            _getRegion(),
            SQLite.initDB(),
            _getLocalData(),
            _synchRef(),
            //.... another promise
        ]).then(res => {
            setTimeout(() =>
                props.onFinish({
                    realApp: true,
                    idleTime: 20,
                    refesh_coordinate: refesh_coordinate,
                    idle_time: idle_time,
                    mount_point: mount_point,
                    shownToolbar: mount_point == '/' ? false : true,
                })
                , 2000)
        });
        return () => {
            log('UNMOUNT SplashScreen');
        }
    }, [])
    const dispatch = useDispatch();
    let refesh_coordinate = 60; 
    let idle_time = 60;
    let mount_point = '/';
    const _getRegion = () => {
        Promise.all([
            dispatch(setProvince(region.filter(item => { return item.level == 0 }))),
            dispatch(setRegency(region.filter(item => { return item.level == 1 }))),
            dispatch(setDistrict(region.filter(item => { return item.level == 2 }))),
            dispatch(setSubDistrict(region.filter(item => { return item.level == 3 }))),
        ]);
    }
    const _synchRef = () => {
        let dvc = (!Device.android && !Device.ios) ? false : true;
        if (dvc) {
            _getReference();
        }else{
            log('_getReference DEV, SELALU AMBIL REF KALO DI WEB');
            POST(`Get_all_refs`, [])
                .then(res => {
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                        .then(insert => _setReference(insert))
                        .catch(err => log(err));
                }).catch(err => log(err));
        }
    }
    const _getReference = async () => {
        try {
            let ref = await SQLite.query('SELECT value FROM Collection WHERE key=?', [REFERENCE]);
            if (Connection() != "OFFLINE" && ref.length == 0) {
                log('_getReference');
                POST(`Get_all_refs`, [])
                    .then(res => {
                        SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                            .then(insert => _setReference(insert))
                            .catch(err => log(err));
                    }).catch(err => log(err));
            } else {
                _setReference();
            }
        } catch (err) {
            log(err)
        }
    }
    const _setReference = () => {
        SQLite.query('SELECT value FROM Collection WHERE key=?', [REFERENCE])
            .then(select => {
                if (select.length > 0) {
                    log('_setReference');
                    let [reference] = select;
                    dispatch(setCallResult(reference.call_result));
                    dispatch(setContactMode(reference.contact_mode));
                    dispatch(setContactPerson(reference.contact_person));
                    dispatch(setPlaceContacted(reference.place_contacted));
                }
            })
            .catch(err => log(err));
    }
    const _getLocalData = () => {
        SQLite.fetchAll()
            .then(res =>
                res.map(item => {
                    switch (item.key) {
                        case PIN: dispatch(setPin(item.value));
                            break;
                        case LIST_ACCOUNT: dispatch(setUser(item.value)); mount_point = (item.value.is_login == true && item.value.PIN != '') ? '/Main/' : '/';
                            break;
                        case DEVICE_INFO: dispatch(setDevice(item.value));
                            break;
                        case DETAIL_COSTUMER: dispatch(setDetailCustomer(item.value));
                            break;
                        case ACTIVITY_HISTORY: dispatch(setActivityHistory(item.value));
                            break;
                        case PAYMENT_HISTORY: dispatch(setPaymetHistory(item.value));
                            break;
                        case REFERENCE:
                            refesh_coordinate = 'refesh_coordinate' in item.value ? item.value.refesh_coordinate : 60;
                            idle_time = 'idle_time' in item.value ? item.value.idle_time : 60;
                        default: log('_getLocalData default');
                    }
                })
            ).catch(err => log(err));
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
