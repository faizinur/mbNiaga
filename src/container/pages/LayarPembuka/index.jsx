import React, { useEffect, useState } from 'react';
import {
    Page,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { log, SQLite, SQLiteTypes, Connection, POST, Device as Perangkat } from '../../../utils';
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
    setBahasa,
    navigate,
} from '../../../config/redux/actions/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import {Toast} from '../../../components/atoms/' 
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
    UPDATE_HISTORY,
    BAHASA,
} = SQLiteTypes;
const LayarPembuka = (props) => {
    useEffect(() => {
        // f7.preloader.show();
        log('MOUNT OR UPDATE LayarPembuka');
        Promise.all([
            SQLite.initDB(),
            _getReference(),
            _getDevice(),
            //.... another promise
        ]).then(res => {
            log('udah beres!',res);
            _getLocalData();
            // setTimeout(() => {
            //     f7.preloader.hide();
            //     // log('yeay finish');
                dispatch(navigate('/Login/'));
            //     // props.onFinish({
            //     //     realApp: true,
            //     //     mount_point: mountPoint,
            //     //     shownToolbar: mountPoint == '/' ? false : true,
            //     // })
            // }, 6000)
        });
        return () => {
            // f7.preloader.hide();
            log('UNMOUNT LayarPembuka');
        }
    }, [])
    const dispatch = useDispatch();
    let refeshCoordinate = useSelector(state => state.reference.refeshCoordinate);
    let idleTime = useSelector(state => state.reference.idleTime);
    let bedaJam = useSelector(state => state.reference.bedaJam);
    let maxBedaJam = useSelector(state => state.reference.maxBedaJam);
    let mountPoint = useSelector(state => state.reference.mountPoint);

    const _getReference = async () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`;
        let dbRes = await SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE]);
        if (dbRes.length == 0) {
            //Toast('AMBIL DATA KE SERVER DULU', 3000, true).open();
            let getRef = await POST(`Get_all_refs`, { jam_mobile: jam_mobile });
            (getRef.status == 'success') ? await SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, getRef.data])
                : await SQLite.query('DELETE FROM COLLECTION WHERE Key=?', [REFERENCE])
        }
        // _getLocalData();
    }
    const _getLocalData = async () => {
        // Toast('AMBIL DATA KE LOKAL DB', 3000, true).open();
        await SQLite.fetchAll()
            .then(res => {
                if (REFERENCE in res) {
                    let call_result = 'call_result' in res.REFERENCE ? res.REFERENCE.call_result : [];
                    let contact_mode = 'contact_mode' in res.REFERENCE ? res.REFERENCE.contact_mode : [];
                    let contact_person = 'contact_person' in res.REFERENCE ? res.REFERENCE.contact_person : [];
                    let place_contacted = 'place_contacted' in res.REFERENCE ? res.REFERENCE.place_contacted : [];

                    // Toast(`
                    // call_result : ${JSON.stringify(call_result).substring(0,150)} 
                    // \n contact_mode : ${JSON.stringify(contact_mode).substring(0,150)}
                    // \n contact_person : ${JSON.stringify(contact_person).substring(0,150)}
                    // \n place_contacted : ${JSON.stringify(place_contacted).substring(0,150)}
                    // `, 4000, true).open();

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

                    let region = 'region' in res.REFERENCE ? res.REFERENCE.region : [];
                    dispatch(setProvince(region.prov));
                    dispatch(setRegency(region.kokab));
                    dispatch(setDistrict(region.kec));
                    dispatch(setSubDistrict(region.kel));
                    region = [];
                }
                if (PIN in res) {
                    dispatch(setPin(res.PIN))
                }
                if (DEVICE_INFO in res) {
                    dispatch(setDevice(res.DEVICE_INFO))
                }
                if (LIST_ACCOUNT in res) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hours = date.getHours();
                    let minutes = date.getMinutes();
                    let seconds = date.getSeconds();
                    let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours < 9 ? '0' + hours : hours}:${minutes < 9 ? '0' + minutes : minutes}:${seconds < 9 ? '0' + seconds : seconds}`;

                    let serverDate = new Date(jam_mobile);
                    serverDate.setSeconds((new Date(res.LIST_ACCOUNT.jam_mobile) - new Date(res.LIST_ACCOUNT.jam_server)) / 1000);
                    let ServerYear = serverDate.getFullYear();
                    let ServerMonth = serverDate.getMonth() + 1;
                    let ServerDay = serverDate.getDate();
                    let ServerHours = serverDate.getHours();
                    let ServerMinutes = serverDate.getMinutes();
                    let ServerSeconds = serverDate.getSeconds();
                    let jam_server = `${ServerYear}-${ServerMonth < 9 ? '0' + ServerMonth : ServerMonth}-${ServerDay} ${ServerHours < 9 ? '0' + ServerHours : ServerHours}:${ServerMinutes < 9 ? '0' + ServerMinutes : ServerMinutes}:${ServerSeconds < 9 ? '0' + ServerSeconds : ServerSeconds}`;

                    res.LIST_ACCOUNT = {
                        ...res.LIST_ACCOUNT, ...{
                            mobileTime: jam_mobile,
                            jam_server: jam_server,
                        }
                    }
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
                if (BAHASA in res) {
                    dispatch(setBahasa(res.BAHASA))
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
        <Page noToolbar noNavbar noSwipeback name="LayarPembuka">
            <div style={styles.container}>
                <p style={styles.text}>Mobile Collection Niaga</p>
            </div>
        </Page >
    )
}

LayarPembuka.propTypes = {
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

export default LayarPembuka;
