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
    GEOLOCATION,
    UPDATE_HISTORY
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


        SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE])
            .then(select => {
                if (select.length == 0) {
                    return POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                } else {
                    _getLocalData()
                    return false;
                }
            })
            .then(ref => {
                if (ref && ref.status == 'success') {
                    return SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, ref.data])
                } else {
                    return false;
                }
            })
            .then(insert => {
                if(insert) _getLocalData()
            })

        /*
        // if (dvc) {
        // if (Connection() != "OFFLINE") {
        log('_getReference DEV, SELALU AMBIL REF KALO DI WEB');
        SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE])
            .then(select => {
                if (select.length == 0) {
                    POST(`Get_all_refs`, { jam_mobile: jam_mobile })
                        .then(res => {
                            log(res.data)
                            SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                                // .then(insert => _getLocalData())
                                .then(insert => log('_getLocalData()'))
                                .catch(err => log(err));
                        }).catch(err => log(err));
                }
                // else {
                // _getLocalData();
                // }
            })
            .catch(err => log(err));
        // }
        // else {
        //     _getLocalData();
        // }
        // }
        */
    }
    const _getLocalData = () => {
        log('_getLocalData')
        SQLite.fetchAll()
            .then(res => {
                if (REFERENCE in res) {
                    let call_result = 'call_result' in res.REFERENCE ? res.REFERENCE.call_result : [];
                    let contact_mode = 'contact_mode' in res.REFERENCE ? res.REFERENCE.contact_mode : [];
                    let contact_person = 'contact_person' in res.REFERENCE ? res.REFERENCE.contact_person : [];
                    let place_contacted = 'place_contacted' in res.REFERENCE ? res.REFERENCE.place_contacted : [];

                    // alert(JSON.stringify(call_result))
                    // alert(JSON.stringify(contact_mode))
                    // alert(JSON.stringify(contact_person))
                    // alert(JSON.stringify(place_contacted))

                    dispatch(setCallResult(call_result));
                    dispatch(setContactMode(contact_mode));
                    dispatch(setContactPerson(contact_person));
                    dispatch(setPlaceContacted(place_contacted));

                    let refesh_coordinate = 'refesh_coordinate' in res.REFERENCE ? res.REFERENCE.refesh_coordinate : refeshCoordinate;
                    let idle_time = 'idle_time' in res.REFERENCE ? res.REFERENCE.idle_time : idleTime;
                    let beda_jam = 'beda_jam' in res.REFERENCE ? res.REFERENCE.beda_jam : bedaJam;
                    let max_beda_jam = 'max_beda_jam' in res.REFERENCE ? res.REFERENCE.max_beda_jam : maxBedaJam;

                    dispatch(setRefreshCoordinate(parseInt(refesh_coordinate)));
                    dispatch(setIdleTime(parseInt(idle_time)));
                    dispatch(setBedaJam(parseInt(beda_jam)));
                    dispatch(setMaxBedaJam(parseInt(max_beda_jam)));
                }
                if (PIN in res) {
                    dispatch(setPin(res.PIN))
                }
                if (DEVICE_INFO in res) {
                    dispatch(setDevice(res.DEVICE_INFO))
                }
                if (LIST_ACCOUNT in res) {
                    dispatch(setUser(res.LIST_ACCOUNT));
                    dispatch(setMountPoint((res.LIST_ACCOUNT.is_login == true && res.LIST_ACCOUNT.PIN != '') ? '/Main/' : '/'));
                }
                if (DETAIL_COSTUMER in res) {
                    dispatch(setDetailCustomer(res.DETAIL_COSTUMER));
                }
                if (ACTIVITY_HISTORY in res) {
                    dispatch(setActivityHistory(res.ACTIVITY_HISTORY));
                }
                if (PAYMENT_HISTORY in res) {
                    dispatch(setPaymetHistory(res.PAYMENT_HISTORY));
                }
                if (UPDATE_HISTORY in res) {
                    log(`handle ${UPDATE_HISTORY}`)
                }
                if (RENCANA_KUNJUNGAN in res) {
                    log(`handle ${RENCANA_KUNJUNGAN}`)
                }
                if (GEOLOCATION in res) {
                    log(`handle ${GEOLOCATION}`)
                }
            })
            .catch(err => log(err));
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
