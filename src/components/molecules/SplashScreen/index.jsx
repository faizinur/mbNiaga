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
import { log, SQLite, SQLiteTypes, Connection, POST, Device as Perangkat } from '../../../utils/';
import PropTypes from 'prop-types';
import { setUser, setDetailCustomer, setActivityHistory, setPaymetHistory, setDevice, setPin, setCallResult, setContactMode, setContactPerson, setPlaceContacted } from '../../../config/redux/actions/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
const {
    PIN,
    DEVICE_INFO,
    LIST_ACCOUNT,
    DETAIL_COSTUMER,
    ACTIVITY_HISTORY,
    PAYMENT_HISTORY,
    REFERENCE,
    RENCANA_KUNJUNGAN,
    GEOLOCATION
} = SQLiteTypes;
const SplashScreen = (props) => {
    useEffect(() => {
        f7.preloader.show();
        log('MOUNT OR UPDATE SplashScreen');
        Promise.all([
            _getRegion(),
            SQLite.initDB(),
            _getLocalData(),
            _getReference(),
            _getDevice(),
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
                    beda_jam: beda_jam,
                    max_beda_jam : max_beda_jam,
                })
                , 2000)
        });
        return () => {
            f7.preloader.hide();
            log('UNMOUNT SplashScreen');
        }
    }, [])
    const dispatch = useDispatch();
    let refesh_coordinate = 60;
    let idle_time = 60;
    let mount_point = '/';
    let beda_jam = 300;
    let max_beda_jam = 300;
    const _getRegion = () => {
        Promise.all([
            dispatch(setProvince(region.filter(item => { return item.level == 0 }))),
            dispatch(setRegency(region.filter(item => { return item.level == 1 }))),
            dispatch(setDistrict(region.filter(item => { return item.level == 2 }))),
            dispatch(setSubDistrict(region.filter(item => { return item.level == 3 }))),
        ]);
    }
    const _getReference = async () => {
        try {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            let seconds = date.getSeconds();
            let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`;

            let ref = await SQLite.query('SELECT value FROM Collection WHERE key=?', [REFERENCE]);
            if (Connection() != "OFFLINE" && ref.length == 0) {
                log('_getReference');
                POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                    .then(res => {
                        SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                            .then(insert => log(insert))
                            .catch(err => log(err));
                    }).catch(err => log(err));
            } else {
                let dvc = (!Device.android && !Device.ios) ? false : true;
                if (!dvc) {
                    log('_getReference DEV, SELALU AMBIL REF KALO DI WEB');
                    POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                        .then(res => {
                            SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }).catch(err => log(err));
                }
            }
        } catch (err) {
            log(err)
        }
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
                            dispatch(setCallResult('call_result' in item.value ? item.value.call_result : {}));
                            dispatch(setContactMode('contact_mode' in item.value ? item.value.contact_mode : {}));
                            dispatch(setContactPerson('contact_person' in item.value ? item.value.contact_person : {}));
                            dispatch(setPlaceContacted('place_contacted' in item.value ? item.value.place_contacted : {}));
                            refesh_coordinate = 'refesh_coordinate' in item.value ? item.value.refesh_coordinate : 60;
                            idle_time = 'idle_time' in item.value ? item.value.idle_time : 60;
                            beda_jam = 'beda_jam' in item.value ? item.value.beda_jam : 300;
                            max_beda_jam = 'max_beda_jam' in item.value ? item.value.max_beda_jam : 300;
                            break;
                        case RENCANA_KUNJUNGAN:
                            log(`handle ${RENCANA_KUNJUNGAN}`)
                            break;
                        case GEOLOCATION:
                            log(`handle ${GEOLOCATION}`)
                            break;
                        default: log('_getLocalData default', item.key);
                    }
                })
            ).catch(err => log(err));
    }
    const _getDevice = async () => {
        let dvcInfo = (!Device.android && !Device.ios) ? 
        { available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' } 
        : await Perangkat.getInformation();
        dispatch(setDevice(dvcInfo));
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
