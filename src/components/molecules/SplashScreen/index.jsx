import React, { useEffect, useState, useRef } from 'react';
import {
    Page,
    f7,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { log, SQLite, SQLiteTypes, Connection, POST, Device as Perangkat } from '../../../utils/';
import region from '../../../data/region.json'
import PropTypes from 'prop-types';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
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
} from '../../../config/redux/actions/';
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
    REGION,
} = SQLiteTypes;

const SplashScreen = (props) => {
    useEffect(() => {
        // f7.preloader.show();
        log('MOUNT OR UPDATE SplashScreen');
        SQLite.initDB()
            .then(res =>
                Promise
                    .all([
                        _getReference(),
                        _getDevice(),
                        _getRegion(),
                        //.... another promise
                    ])
                    .then(res => _getLocalData())
            )
            .catch(err => f7.dialog.alert(JSON.stringify(err)))
        return () => {
            log('UNMOUNT SplashScreen');
        }
    }, [])

    const dispatch = useDispatch();
    let refeshCoordinate = useSelector(state => state.reference.refeshCoordinate);
    let idleTime = useSelector(state => state.reference.idleTime);
    let bedaJam = useSelector(state => state.reference.bedaJam);
    let maxBedaJam = useSelector(state => state.reference.maxBedaJam);
    let mountPoint = useSelector(state => state.reference.mountPoint);

    const [deviceState, setDeviceState] = useState('');
    const [refState, setRefState] = useState('');
    const [localDBState, setLocalDBState] = useState('');
    const _getReference = async () => {
        setRefState('...')
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let jam_mobile = `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`;
        //alert('cek DB');

        let dbRes = await SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REFERENCE]);
        //alert('DEB RES'+JSON.stringify(dbRes));
        if (dbRes.length == 0) {
            // Toast('AMBIL DATA KE SERVER', 1000, true).open();
            //alert('ambil ke server');
            try {
                let getRef = await POST(`Get_all_refs`, { jam_mobile: jam_mobile });
                if (getRef.status == 'success') {
                    //alert('REF SUCCESS');
                    await SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, getRef.data])
                } else {
                    //alert('REF FAILED');
                    await SQLite.query('DELETE FROM COLLECTION WHERE Key=?', [REFERENCE])
                }
            } catch (errRef) {
                f7.dialog.alert(errRef);
            }
        } else {
            //alert('MASUK SINI!'+JSON.stringify(dbRes))
        }
        setRefState('OK!')
    }
    const _getRegion = async () => {
        let prov = region.filter(item => { return item.level == 0 });
        let kokab = region.filter(item => { return item.level == 1 });
        let kec = region.filter(item => { return item.level == 2 });
        let kel = region.filter(item => { return item.level == 3 });
        dispatch(setProvince(prov));
        dispatch(setRegency(kokab));
        dispatch(setDistrict(kec));
        dispatch(setSubDistrict(kel));
        /*
        //cek DB kalo ada region post lastUpdated time dari region DB
        let regionDB = await SQLite.query('SELECT value FROM COLLECTION WHERE KEY=?', [REGION]);
        log('regionDB', regionDB)
        // kalo gak ada ambil dari file JSON.
        let lastUpdate = regionDB.length == 0 || regionDB[0].length == 0 ?
            new Date(Math.max(...region.map(item => new Date(item.updated_time)))) :
            new Date(Math.max(...regionDB[0].map(item => new Date(item.updated_time))));
        //generate updated_time
        var year = lastUpdate.getFullYear();
        var month = (lastUpdate.getMonth() + 1) < 10 ? '0' + (lastUpdate.getMonth() + 1) : (lastUpdate.getMonth() + 1);
        var day = lastUpdate.getDate();
        var hours = lastUpdate.getHours();
        var minutes = (lastUpdate.getMinutes() + 1) < 10 ? '0' + (lastUpdate.getMinutes() + 1) : (lastUpdate.getMinutes() + 1);
        var seconds = lastUpdate.getSeconds();
        //sych Region
        try {
            let param = { updated_time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` };
            let getRegionRes = await POST('Get_region', param);
            let prov = region.filter(item => { return item.level == 0 });
            let kokab = region.filter(item => { return item.level == 1 });
            let kec = region.filter(item => { return item.level == 2 });
            let kel = region.filter(item => { return item.level == 3 });
            if (getRegionRes.status == "success") {
                if (getRegionRes.data.length > 0) {
                    log('ada data baru')
                    // merge datanya sama file JSON yang ada.
                    let updatedProv = getRegionRes.data.filter(item => { return item.level == 0 });
                    let updatedKokab = getRegionRes.data.filter(item => { return item.level == 1 });
                    let updatedKec = getRegionRes.data.filter(item => { return item.level == 2 });
                    let updatedKel = getRegionRes.data.filter(item => { return item.level == 3 });
                    //cocokin data
                    prov = _compareRegion(updatedProv, prov);
                    kokab = _compareRegion(updatedKokab, kokab);
                    kec = _compareRegion(updatedKec, kec);
                    kel = _compareRegion(updatedKel, kel);
                    updatedProv = [];
                    updatedKokab = [];
                    updatedKec = [];
                    updatedKel = [];
                    //bandingkan data region (getRegionRes dari API) dengan (regionDB local DB)
                    regionDB = _compareRegion(getRegionRes.data, regionDB);
                    //simpan ke lokal Data
                    await SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REGION, regionDB])
                }
            }
            dispatch(setProvince(prov));
            dispatch(setRegency(kokab));
            dispatch(setDistrict(kec));
            dispatch(setSubDistrict(kel));
            prov = [];
            kokab = [];
            kec = [];
            kel = [];
        } catch (errReg) {
            log(errReg)
        }
        */
    }
    const _getLocalData = async () => {
        log('Collecting....')
        setLocalDBState('...')
        SQLite.fetchAll()
            .then(res => {
                log('_getLocalData', res);
                if (REFERENCE in res) {
                    let call_result = 'call_result' in res.REFERENCE ? res.REFERENCE.call_result : [];
                    let contact_mode = 'contact_mode' in res.REFERENCE ? res.REFERENCE.contact_mode : [];
                    let contact_person = 'contact_person' in res.REFERENCE ? res.REFERENCE.contact_person : [];
                    let place_contacted = 'place_contacted' in res.REFERENCE ? res.REFERENCE.place_contacted : [];

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
                setLocalDBState('OK!')
                f7.preloader.hide();
                ////alert('local Data....');
                props.onFinish({
                    realApp: true,
                    mount_point: mountPoint,
                    shownToolbar: mountPoint == '/' ? false : true,
                })
            })
            .catch(err => log(err));
    }
    const _getDevice = async () => {
        setDeviceState('...')
        let dvcInfo = (!Device.android && !Device.ios) ?
            { available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' }
            : await Perangkat.getInformation();
        dispatch(setDevice(dvcInfo));
        setDeviceState('OK!')
    }
    const _compareRegion = (newData, oldData) => {
        newData.map(item => {
            let indexFound = oldData.findIndex(oldItem => {
                return oldItem.code === item.code;
            });
            if (indexFound === -1) { // gak ketemu!
                log('data gak ketemu, append array');
                oldData = [...oldData, item];
            } else {
                log('data ketemu, replace ayya array di index ' + indexFound);
                // oldData[indexFound] = { ...oldData[indexFound], ...item };
                oldData[indexFound] = item;
            }
        });
        return oldData;
    }
    const _fotoResult = (data) => {
        alert(JSON.stringify(data));
    }
    return (
        <Page noToolbar noNavbar noSwipeback name="SplashScreen">
            <div style={styles.container}>
                <p style={styles.text}>Mobile Collection Niaga</p><br /><br />
            </div>
            <div
                style={{
                    width: '100%',
                    height: 'fit-content',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    display: props.shown == false ? 'none' : 'block',
                }}>
                <div
                    style={{ display: (deviceState == '' ? 'none' : 'flex'), flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}
                >
                    <p style={{ margin: 0 }}>Retrieving Device info</p>
                    <p style={{ margin: 0 }}>{deviceState}</p>
                </div>
                <div
                    style={{ display: (refState == '' ? 'none' : 'flex'), flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}
                >
                    <p style={{ margin: 0 }}>Downloading</p>
                    <p style={{ margin: 0 }}>{refState}</p>
                </div>
                <div
                    style={{ display: (localDBState == '' ? 'none' : 'flex'), flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}
                >
                    <p style={{ margin: 0 }}>Collecting</p>
                    <p style={{ margin: 0 }}>{localDBState}</p>
                </div>
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
