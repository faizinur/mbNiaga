import React, { Component } from 'react';
import {
    Block,
    Col,
    Page,
    LoginScreenTitle,
    List,
    Button,
    ListInput,
    Row,
    f7,
    Popup,
    Icon,
    Sheet,
    BlockTitle,
    ListItem,
} from 'framework7-react';

import { connect } from 'react-redux';
import stylesheet from './stylesheet';
import {
    navigate,
    setDevice,
    setUser,
    setDetailCustomer,
    setActivityHistory,
    setPaymetHistory,
    setPin,
    setCallResult,
    setContactMode,
    setContactPerson,
    setPlaceContacted,
    setBahasa,
} from '../../../config/redux/actions/';
import { POST, Device as Perangkat, log, Connection, SQLite, SQLiteTypes } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { DaftarPin, Check, DeviceInfo } from '../../pages/';
import { CustomStatusBar } from '../../../components/atoms/';
import { Login as Strings } from '../../../utils/Localization';
import { Camera } from '../../../components/molecules';
const {
    PIN,
    DEVICE_INFO,
    LIST_ACCOUNT,
    DETAIL_COSTUMER,
    ACTIVITY_HISTORY,
    PAYMENT_HISTORY,
    REFERENCE,
    REKAP_TERTUNDA,
    RENCANA_KUNJUNGAN,
    UPDATE_HISTORY,
    BAHASA,
}
    = SQLiteTypes;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // username: (!Device.android && !Device.ios) ? 'TEST' : '',
            // password: (!Device.android && !Device.ios) ? '1234' : '',
            username: 'TEST',
            password: '1234',
            popUpStateDaftarPin: false,
            popUpStateLoginPin: false,
            popUpStateDeviceInfo: false,
            sheetBahasa: false,
            resultLogin: [],//['MobileData','Airplane','LoginTime','DeviceTime','UserAuth','DeviceAuth','ICCIDAuth']
            user: {},
            inputPasswordType: 'password',
            language: props.bahasa,
            version: {
                appName: 'MobColl',
                major: '0',
                minor: '1',
                patch: '4',
                release: 'alpha',
            }
        };
        Strings.setLanguage(this.state.language);
        // props.setUser({});
        this.cameraRef = React.createRef();
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ');
        log('HIDE SHOW POPUP!');
        if (f7.views.main.router.history.length == 0) { //GARA GARA GOBACK REDUX ini ke load lagi jadi di cek kalo / berarti pertama login
            // this.setState({ popUpStateLoginPin: (this.props.pin != "" && this.props.profile.is_login == true) ? true : false });
        }
    }
    _onClickLogin = async () => {
        if (this.props.pin != "" && this.props.profile.is_login == true) {
            this.setState({ popUpStateLoginPin: true })
            return false;
        } else {
            this.setState({ popUpStateLoginPin: false })
        }
        let dvc = (!Device.android && !Device.ios) ? false : true;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        try {
            if (dvc) {
                // this.props.setDevice({
                //     ...await Perangkat.getInformation(),
                //     ...{
                //         serial: cordova.plugins.uid.ICCID === undefined ? 'undefined' : cordova.plugins.uid.ICCID
                //     }
                // });
                this.props.setDevice(await Perangkat.getInformation());
                if (Connection() == 'OFFLINE') {
                    this._setLoginResult('MobileData');
                    f7.dialog.alert('Pastikan anda tersambung jaringan internet')
                    return false;
                }
            } else {
                //Dummy Data
                this.props.setDevice({ available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' });
            }
            const { username, password } = this.state;
            const { uuid, serial } = this.props.device;
            var data = {
                username: username,
                password: password,
                imei: JSON.stringify(uuid),
                iccd: JSON.stringify(serial),
                jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours < 9 ? '0' + hours : hours}:${minutes < 9 ? '0' + minutes : minutes}:${seconds < 9 ? '0' + seconds : seconds}`,
            }
            const userPIN = await SQLite.query('SELECT value from COLLECTION where key=?', [PIN]);
            POST(`Login`, data)
                .then(res => {
                    this._getDelayedList()
                        .then(e => {
                            log('AYO LANJUT LOGIN!');
                            res.data = {
                                ...res.data,
                                ...{
                                    mobileTime: data.jam_mobile,
                                    jam_server: res.data.jam_server,
                                    is_login: true,
                                }
                            }
                            if (userPIN.length == 0 || userPIN == "") {
                                // this._getReference();
                                this.setState({ user: res.data, popUpStateDaftarPin: true })
                                //--> _submitPIN
                            } else {
                                this._getUserInfo({
                                    ...res.data,
                                    ...{ PIN: userPIN[0] }
                                });
                                // this._setReference();
                            }
                        })
                        .catch(err => log(err));
                })
                .catch(err => {
                    switch (err) {
                        case 'Username/Password tidak valid': this._setLoginResult('UserAuth');
                            break;
                        case 'Tidak Boleh Login Sebelum Jam 8 Pagi': this._setLoginResult('LoginTime');
                            break;
                        case 'Jam Pada Perangkat Tidak Sesuai': this._setLoginResult('DeviceTime');
                            break;
                        default: log(err)
                    }
                });
        } catch (err) {
            f7.dialog.alert(err);
        }
    }
    _submitPIN = async (PIN) => {
        let dvcInfo = (!Device.android && !Device.ios) ?
            { available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' }
            :
            await Perangkat.getInformation();
        // {
        //     ...await Perangkat.getInformation(),
        //     ...{
        //         serial: cordova.plugins.uid.ICCID
        //     }
        // };
        this.props.setDevice(dvcInfo);
        let userTmp = {
            ...Object.assign({}, this.state.user),
            ...{ PIN: PIN }
        }
        this.setState({ user: userTmp })
        this._getUserInfo(userTmp);
    }
    _onValidatePIN = async (inputPIN) => {

        let dvcInfo = (!Device.android && !Device.ios) ?
            { available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' }
            :
            await Perangkat.getInformation();
        // {
        //     ...await Perangkat.getInformation(),
        //     ...{
        //         serial: cordova.plugins.uid.ICCID
        //     }
        // };
        log('_onValidatePIN : ', inputPIN)
        SQLite.query('select value from COLLECTION where key=?', [PIN])
            .then(res => {
                if (res[0] === inputPIN) {
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [DEVICE_INFO, this.props.device])
                        .then(res => {
                            this.props.setDevice(dvcInfo);
                            this.props.setPin(inputPIN);
                            this.setState({ popUpStateLoginPin: false });
                            this.props.navigate('/Main/');
                        }).catch(err => log(err));
                } else {
                    f7.dialog.alert('PIN belum benar!');
                }
            }).catch(err => log(err));
    }
    _getDelayedList = () => {
        return new Promise((resolve, reject) => {
            SQLite.query('SELECT value from Collection where key=?', [REKAP_TERTUNDA])
                .then(select => {
                    if (select.length == 0) {
                        resolve(true);
                        return;
                    }
                    if (select[0].length == 0) {
                        resolve(true);
                        return;
                    };
                    var params = [];
                    select[0].map((item) => {
                        params = [...params, [item.transaction_type == 'KUNJUNGAN' ? 'save_visit_history' : 'save_update_data', item]];
                    })
                    Promise.all(params.map(item => SQLite._getImage(item[1].id)))
                        .then(images => {
                            images.map(image => {
                                params.forEach((item) => {
                                    if (item[1].id === image[0].id) {
                                        item[1].gambar = image[0].data
                                    }
                                });
                            })

                            this._kirimDataTertunda(params)
                                .then(res => {
                                    log("HASIL KIRIM: ", res)
                                    var gagalKirim = [];
                                    res.map((item, index) => {
                                        if (item == "GAGAL")
                                            gagalKirim = [...gagalKirim, select[0][index]]
                                    })
                                    resolve(true);
                                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REKAP_TERTUNDA, gagalKirim])
                                        .then(insert => gagalKirim.length != 0 ? reject("GAGAL KIRIM REKAP TERTUNDA") : resolve(true))
                                        .catch(err => reject(err));
                                }).catch(err => reject(err))
                        })
                        .catch(err => {
                            log(err);
                        })
                }).catch(err => reject(err));
        })
    }

    _kirimDataTertunda = (params) => {
        let reqList = [];
        params.map(item =>
            reqList.push(
                new Promise((resolve, reject) => {
                    POST(...item)
                        .then(res => resolve(res.status != 'success' ? "GAGAL" : "BERHASIL")
                        ).catch(err => reject(err));
                })
            ));
        return Promise.all(reqList);
    }
    _getUserInfo = (data) => {
        POST(['get_detail_cust', { agent: data.id }], ['get_activity_history', { agent: data.id }], ['get_payment_history', { agent: data.id }], ['get_update_history', { agent: data.id }])
            .then(res => {
                let failedResponse = res.filter(item => { return item.status != "success" });
                if (failedResponse.length > 0) {
                    f7.dialog.alert(failedResponse[0].message);
                    return false;
                }
                failedResponse = [];
                const [detailCustomer, activityHistory, paymentHistory, updateHistory] = res;

                let promiseUserInfo = [
                    this.props.setUser(data),
                    this.props.setPin(data.PIN),
                    this.props.setPaymetHistory(paymentHistory),
                    this.props.setActivityHistory(activityHistory),
                    this.props.setDetailCustomer(detailCustomer),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [PIN, data.PIN]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [DEVICE_INFO, this.props.device]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [LIST_ACCOUNT, data]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [DETAIL_COSTUMER, detailCustomer.data]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [ACTIVITY_HISTORY, activityHistory.data]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [PAYMENT_HISTORY, paymentHistory.data]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [UPDATE_HISTORY, updateHistory.data]),
                    SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [RENCANA_KUNJUNGAN, []]),
                ]
                f7.preloader.show();
                Promise.all(promiseUserInfo)
                    .then(res => {
                        f7.preloader.hide();
                        this.setState({ popUpStateDaftarPin: false });
                        this.props.navigate('/Main/', true);
                    })
                    .catch(err => log(err))
            }).catch(err => log(err))
    }
    _setLoginResult = (key = '') => {
        if (!this.state.resultLogin.includes(key)) {
            let tmpResultLogin = Object.assign([], this.state.resultLogin);
            tmpResultLogin.push(key);
            this.setState({ resultLogin: tmpResultLogin });
        } else {
            this.setState({ resultLogin: [] });
        }
    }
    _onClickDeviceInfo = async () => {
        this.setState({ popUpStateDeviceInfo: true })
        this.props.setDevice(await Perangkat.getInformation());
        // this.props.setDevice({
        //     ...await Perangkat.getInformation(),
        //     ...{
        //         serial: cordova.plugins.uid.ICCID
        //     }
        // });
    }
    _onChangeBahasa = async () => {
        let { language } = this.state;
        let { bahasa } = this.props;
        if (language == null || language == '') return false;
        if (language == bahasa) return false;
        SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [BAHASA, language])
            .then(res => {
                Strings.setLanguage(language);
                this.setState({});
                this.props.setBahasa(language)
                this.props.navigate('/Login/')
                f7.views.main.router.history = ['/'];
            })
            .catch(err => log(err));
    }
    render() {
        let { appName, major, minor, patch, release } = this.state.version;
        return (
            <div>
                <div style={{ position: 'absolute', width: '100%', height: 20, left: 0, bottom: 0, display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 999999, }}>
                    <p style={{ margin: 0, fontSize: 'smaller' }}>{`${appName} v${major}.${minor}.${patch}-${release}`}</p>
                </div>
                <Camera ref={this.cameraRef} />
                <Page loginScreen name="Login" >
                    <center>
                        <img style={{ height: 100, width: 100 }} src={require(`../../../assets/img/ic_apps_ios.png`).default} />
                    </center>
                    <LoginScreenTitle style={{ ...stylesheet.LogisnScreenTitle, ...{ marginTop: 0, fontSize: 'larger' } }}>Mobile Application Interaction</LoginScreenTitle>
                    <List style={{ margin: 0, width: '100%' }}>
                        <ListInput
                            outline
                            type="text"
                            label={Strings.usernameLabel}
                            placeholder={Strings.usernamePlaceholder}
                            value={this.state.username}
                            onInput={(e) => {
                                this.setState({ username: e.target.value });
                            }}
                        />
                    </List>
                    <div style={{ display: 'flex', flex: 1 }}>
                        <List style={{ margin: 0, width: '100%' }}>
                            <ListInput
                                outline
                                type={this.state.inputPasswordType}
                                label={Strings.passwordLabel}
                                placeholder={Strings.passwordPlaceholder}
                                value={this.state.password}
                                onInput={(e) => {
                                    this.setState({ password: e.target.value });
                                }}
                            />
                        </List>
                        {
                            this.state.password.length > 0 &&
                            <div style={{ position: 'absolute', height: 63, width: 40, right: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                <div
                                    onClick={
                                        () =>
                                            this.setState({
                                                inputPasswordType: this.state.inputPasswordType == 'password' ? 'text' : 'password'
                                            })
                                    }
                                    style={{ marginTop: 20, borderRadius: 25, }}>
                                    <Icon
                                        style={{ color: '#c0392b' }}
                                        f7={this.state.inputPasswordType == 'password' ? 'eye_slash' : 'eye'}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <List noHairlinesMd>
                        <Block>
                            <Row>
                                <Col width="100">
                                    <Button
                                        onClick={() => this._onClickLogin()}
                                        round
                                        style={{ backgroundColor: '#c0392b', color: 'white' }}
                                        text={Strings.login}
                                    />
                                </Col>
                            </Row>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="100">
                                    <Button
                                        onClick={() => this._onClickDeviceInfo()}
                                        round
                                        style={{ backgroundColor: 'transparent', color: '#c0392b' }}
                                        text={Strings.deviceInfo}
                                    />
                                </Col>
                            </Row>
                        </Block>
                        {/* <Block>
                            <Row>
                                <Col width="100">
                                    <Button
                                        onClick={() => this._generateBase64()}
                                        round
                                        style={{ backgroundColor: 'transparent', color: '#c0392b' }}
                                        text={'Strings.deviceInfo'}
                                    />
                                </Col>
                            </Row>
                        </Block> */}
                        <Block>
                            <Row>
                                <Col width="100">
                                    <Button
                                        onClick={() => this.setState({ sheetBahasa: true })}
                                        round
                                        style={{ backgroundColor: 'transparent', color: '#c0392b' }}
                                        text={Strings.bahasa}
                                    />
                                </Col>
                            </Row>
                        </Block>
                    </List>
                    <Popup
                        className="daftarPin-popup"
                        opened={this.state.popUpStateDaftarPin}
                        onPopupClosed={() => log('pop up Closed')}
                    >
                        <CustomStatusBar />
                        <DaftarPin
                            onSubmitPIN={this._submitPIN}
                        />
                    </Popup>
                    <Popup
                        className="loginPin-popup"
                        opened={this.state.popUpStateLoginPin}
                        onPopupClosed={() => log('pop up Closed')}
                    >
                        <CustomStatusBar />
                        <DaftarPin
                            onValidatePIN={this._onValidatePIN}
                        />
                    </Popup>
                    <Popup
                        className="failedLogin-popup"
                        opened={this.state.resultLogin.length > 0 ? true : false}
                        onPopupClosed={() => log('pop up Closed')}
                    >

                        {
                            this.state.resultLogin.length > 0 ?
                                <>
                                    <CustomStatusBar />
                                    <Check
                                        onClick={(e) => this._setLoginResult()}
                                        title={Strings.failedLogin}
                                        loginResult={this.state.resultLogin}
                                    />
                                </>
                                :
                                <></>
                        }
                    </Popup>
                    <Popup
                        className="deviceInfo-popup"
                        opened={this.state.popUpStateDeviceInfo}
                        onPopupClosed={() => log('pop up Closed')}
                    >
                        <DeviceInfo
                            onClick={(e) => this.setState({ popUpStateDeviceInfo: false })}
                        />
                    </Popup>
                    <Sheet
                        className="demo-sheet-swipe-to-step"
                        style={{ height: 'auto', '--f7-sheet-bg-color': '#fff' }}
                        swipeToStep
                        backdrop
                        opened={this.state.sheetBahasa}
                        swipeToClose={false}
                        closeByBackdropClick={false}
                        closeByOutsideClick={false}
                        onSheetOpen={(e) => {
                            let backdrop = document.getElementsByClassName('sheet-backdrop backdrop-in');
                            backdrop[0].style.backgroundColor = 'rgb(192, 57, 43,0.4)';
                        }}
                        style={{
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                    >
                        <div className="sheet-modal-swipe-step">
                            <div className="padding-horizontal padding-bottom">
                                <div className="margin-top text-align-center">{Strings.pilihBahasa}</div>
                                <List>
                                    <ListInput
                                        // outline
                                        type="select"
                                        defaultValue={this.state.language}
                                        onChange={({ target }) => {
                                            this.setState({ language: target.value });
                                            Strings.setLanguage(target.value)
                                        }}
                                    >
                                        <option value="" disabled>--{Strings.choose}--</option>
                                        {
                                            Strings.getAvailableLanguages().map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))
                                        }
                                    </ListInput>
                                </List>
                                <Button
                                    large
                                    fill
                                    style={{ backgroundColor: '#c0392b', color: 'white' }}
                                    onClick={() => {
                                        this.setState({ sheetBahasa: false }, () => {
                                            this._onChangeBahasa()
                                        })
                                    }}
                                >
                                    {Strings.pilih}
                                </Button>
                            </div>
                        </div>
                    </Sheet>
                </Page >
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        detailCust: state.user.detailCust,
        activityHistory: state.user.activityHistory,
        paymentHistory: state.user.paymentHistory,
        device: state.main.device,
        pin: state.user.pin,
        bahasa: state.main.bahasa,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (data) => dispatch(setUser(data)),
        navigate: (nav) => dispatch(navigate(nav)),
        setDevice: (device) => dispatch(setDevice(device)),
        setDetailCustomer: (data) => dispatch(setDetailCustomer(data)),
        setActivityHistory: (data) => dispatch(setActivityHistory(data)),
        setPaymetHistory: (data) => dispatch(setPaymetHistory(data)),
        setPin: (data) => dispatch(setPin(data)),
        setCallResult: (data) => dispatch(setCallResult(data)),
        setContactMode: (data) => dispatch(setContactMode(data)),
        setContactPerson: (data) => dispatch(setContactPerson(data)),
        setPlaceContacted: (data) => dispatch(setPlaceContacted(data)),
        setBahasa: (data) => dispatch(setBahasa(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);