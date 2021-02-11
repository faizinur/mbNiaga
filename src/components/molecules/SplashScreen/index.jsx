import React, { useEffect, useState } from 'react';
import {
    Page,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import region from '../../../data/region.json';
import { log, SQLite, SQLiteTypes, Connection, POST, Device as Perangkat } from '../../../utils/';
import PropTypes from 'prop-types';
import {
    setProvince,
    setRegency,
    setDistrict,
    setSubDistrict,
    setMountPoint,
    setUser,
    setDetailCustomer,
    setActivityHistory,
    setPaymetHistory,
    setDevice,
    setPin,
    setCallResult,
    setContactMode,
    setContactPerson,
    setPlaceContacted,
    setRefreshCoordinate,
    setIdleTime,
    setBedaJam,
    setMaxBedaJam,
} from '../../../config/redux/actions/';
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
            _getReference(),
            _getDevice(),
            //.... another promise
        ]).then(res => {
            setTimeout(() =>
                props.onFinish({
                    realApp: true,
                    mount_point: mountPoint,
                    shownToolbar: mountPoint == '/' ? false : true,
                })
                , 2000)
        });
        return () => {
            f7.preloader.hide();
            log('UNMOUNT SplashScreen');
        }
    }, [])
    const dispatch = useDispatch();
    let refeshCoordinate = useSelector(state => state.reference.refeshCoordinate);
    let idleTime = useSelector(state => state.reference.idleTime);
    let bedaJam = useSelector(state => state.reference.bedaJam);
    let maxBedaJam = useSelector(state => state.reference.maxBedaJam);
    let mountPoint = useSelector(state => state.reference.mountPoint);

    const _getRegion = () => {
        // const promises = [
        dispatch(setProvince(region.filter(item => { return item.level == 0 })));
        dispatch(setRegency(region.filter(item => { return item.level == 1 })));
        dispatch(setDistrict(region.filter(item => { return item.level == 2 })));
        dispatch(setSubDistrict(region.filter(item => { return item.level == 3 })));
        // ].map(n => Promise.resolve(n));
        // const [res1, res2] = await Promise.all(promises)

        // Promise.all();
    }
    const _getReference = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        let seconds = date.getSeconds();
        let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`;
        let dvc = (!Device.android && !Device.ios) ? false : true;

        if (dvc) {
            if (Connection() != "OFFLINE") {
                log('_getReference');
                SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE])
                    .then(select => {
                        if (select.length == 0) {
                            POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                                .then(res => {
                                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                                        .then(insert => {
                                            _getLocalData()
                                        })
                                        .catch(err => log(err));
                                }).catch(err => log(err));
                        } else {
                            _getLocalData();
                        }
                    })
                    .catch(err => log(err));
            } else {
                // _getLocalData();
            }
        } else {
            log('_getReference DEV, SELALU AMBIL REF KALO DI WEB');
            SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE])
                .then(select => {
                    if (select.length == 0) {
                        POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                            .then(res => {
                                log(res.data)
                                SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                                    .then(insert => _getLocalData())
                                    .catch(err => log(err));
                            }).catch(err => log(err));
                    } else {
                        _getLocalData();
                    }
                })
                .catch(err => log(err));
        }
    }
    const _getLocalData = () => {
        SQLite.fetchAll()
            .then(res => {
                let [data, dec] = res;
                data.map(item => {
                    item.value = dec(item.value);
                    alert(`${JSON.stringify(item.key)} => ${JSON.stringify(item.value)}`)
                    switch (item.key) {
                        case PIN: dispatch(setPin(item.value));
                            break;
                        case LIST_ACCOUNT:
                            dispatch(setUser(item.value));
                            dispatch(setMountPoint(item.value.is_login == true && item.value.PIN != '') ? '/Main/' : '/');
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

                            let refesh_coordinate = 'refesh_coordinate' in item.value ? item.value.refesh_coordinate : refeshCoordinate;
                            let idle_time = 'idle_time' in item.value ? item.value.idle_time : idleTime;
                            let beda_jam = 'beda_jam' in item.value ? item.value.beda_jam : bedaJam;
                            let max_beda_jam = 'max_beda_jam' in item.value ? item.value.max_beda_jam : maxBedaJam;

                            // alert(`_getLocalData SplashScreen bedaJam : ${beda_jam},  maxBedaJam : ${max_beda_jam}`);
                            dispatch(setRefreshCoordinate(parseInt(refesh_coordinate)));
                            dispatch(setIdleTime(parseInt(idle_time)));
                            dispatch(setBedaJam(parseInt(beda_jam)));
                            dispatch(setMaxBedaJam(parseInt(max_beda_jam)));
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
            }).catch(err => log(err));
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
