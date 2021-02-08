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
    ListGroup,
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
    setPlaceContacted
} from '../../../config/redux/actions/';
import { POST, Device as Perangkat, log, Connection, SQLite, SQLiteTypes } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { DaftarPin, Check } from '../../pages/';
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
}
    = SQLiteTypes;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',//'USER_TEST_1',
            password: '',//'12345678',
            popUpStateDaftarPin: false,
            popUpStateLoginPin: false,
            resultLogin: [],//['MobileData','Airplane','LoginTime','DeviceTime','UserAuth','DeviceAuth','ICCIDAuth']
            user: {}
        };
        // props.setUser({});
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ');
        if (this.props.pin != "" && this.props.profile.is_login == true) {
            // log('TAMPILKAN POPUP!');
            this.setState({ popUpStateLoginPin: true })
        } else {
            // log('TUTUP POPUP!')
            this.setState({ popUpStateLoginPin: false })
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
        var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        var seconds = date.getSeconds();


        try {
            if (dvc) {
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
                jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`,
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
    _submitPIN = (PIN) => {
        let userTmp = {
            ...Object.assign({}, this.state.user),
            ...{ PIN: PIN }
        }
        this.setState({ user: userTmp })
        this._getUserInfo(userTmp);
    }
    _onValidatePIN = (inputPIN) => {
        log('_onValidatePIN : ', inputPIN)
        SQLite.query('select value from COLLECTION where key=?', [PIN])
            .then(res => {
                if (res[0] === inputPIN) {
                    this.props.setPin(inputPIN);
                    this.props.navigate('/Main/');
                    this.setState({ popUpStateLoginPin: false });
                    // this._setReference();
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
                        params = [...params, [item.transaction_type == 'KUNJUNGAN' ? 'save_visit_history' : 'save_update_data', item]]
                    })
                    this._kirimDataTertunda(params)
                        .then(res => {
                            log("HASIL KIRIM: ", res)
                            var gagalKirim = [];
                            res.map((item, index) => {
                                if (item == "GAGAL")
                                    gagalKirim = [...gagalKirim, select[0][index]]
                            })
                            SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REKAP_TERTUNDA, gagalKirim])
                                .then(insert => gagalKirim.length != 0 ? reject("GAGAL KIRIM REKAP TERTUNDA") : resolve(true))
                                .catch(err => reject(err));
                        }).catch(err => reject(err))
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
    _getReference = () => {
        POST(`Get_all_refs`, [])
            .then(res => {
                // SQLite.query('SELECT value from Collection where key=?', [REFERENCE])
                //     .then(select => {
                SQLite.query('INSERT OR REPLACE INTO COLLECTION (key, value) VALUES(?,?)', [REFERENCE, res.data])
                    .then(insert => this._setReference())
                    .catch(err => log(err));
            }).catch(err => log(err));
        // })
        // .catch(err => log(err));
    }
    _setReference = () => {
        SQLite.query('SELECT value FROM Collection WHERE key=?', [REFERENCE])
            .then(select => {
                if (select.length > 0) {
                    let [reference] = select;
                    this.props.setCallResult(reference.call_result)
                    this.props.setContactMode(reference.contact_mode)
                    this.props.setContactPerson(reference.contact_person)
                    this.props.setPlaceContacted(reference.place_contacted)
                }
            })
            .catch(err => log(err));
    }
    render() {
        return (
            <Page noToolbar noNavbar noSwipeback loginScreen name="Login">
                <LoginScreenTitle style={stylesheet.LoginScreenTitle}>Mobile Application Interaction</LoginScreenTitle>
                <List inlineLabels noHairlinesMd>
                    <ListInput
                        outline
                        label="Username :"
                        type="text"
                        value={this.state.username}
                        onInput={(e) => {
                            this.setState({ username: e.target.value });
                        }}
                    />
                    <ListInput
                        outline
                        label="Password :"
                        type="password"
                        value={this.state.password}
                        onInput={(e) => {
                            this.setState({ password: e.target.value });
                        }}
                    />
                </List>
                <List noHairlinesMd>
                    <Block>
                        <Row>
                            <Col width="100">
                                <Button
                                    onClick={() => this._onClickLogin()}
                                    round
                                    style={{ backgroundColor: '#c0392b', color: 'white' }}
                                    text="Login"
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
                    <DaftarPin
                        onSubmitPIN={this._submitPIN}
                    />
                </Popup>

                <Popup
                    className="loginPin-popup"
                    opened={this.state.popUpStateLoginPin}
                    onPopupClosed={() => log('pop up Closed')}
                >
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
                            <Check
                                backLink={(e) => this._setLoginResult()}
                                title={"Gagal Login"}
                                loginResult={this.state.resultLogin}
                            />
                            :
                            <></>
                    }
                </Popup>
            </Page>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);