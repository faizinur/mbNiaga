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
} from 'framework7-react';

import { connect } from 'react-redux';
import stylesheet from './stylesheet';
import { log, Connection, SQLite, SQLiteTypes } from '../../../utils/';
import { navigate, setDevice, setUser, setDetailCustomer, setActivityHistory, setPaymetHistory, } from '../../../config/redux/actions/';
import { POST } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { DaftarPin, Check } from '../../pages/';
const { PIN, DEVICE_INFO, LIST_ACCOUNT, DETAIL_COSTUMER, ACTIVITY_HISTORY, PAYMENT_HISTORY} = SQLiteTypes;
class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: (!Device.android && !Device.ios) ? 'USER_TEST_1' : '',
            password: (!Device.android && !Device.ios) ? '12345678' : '',
            popUpStateDaftarPin: false,
            resultLogin: [],//['MobileData','Airplane','LoginTime','DeviceTime','UserAuth','DeviceAuth','ICCIDAuth']
            user: {}
        };
        props.setUser({});
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ');
        // this._onClickLogin();
    }
    _onClickLogin = async () => {
        let dvc = (!Device.android && !Device.ios) ? false : true;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        var seconds = date.getSeconds();
        
        const { username, password } = this.state;
        var data = {
            username: username,
            password: password,
            imei: JSON.stringify(this.props.device.uuid),
            iccd: JSON.stringify(this.props.device.serial),
            jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`,
        }
        
        try {
            if (dvc) {
                this.props.setDevice(await Device.getInformation());
                if (Connection() == 'OFFLINE') {
                    this._setLoginResult('MobileData');
                    f7.dialog.alert('Pastikan anda tersambung jaringan internet')
                    return false;
                }
            } else {
                this.props.setDevice({ available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' });
            }
            const userPIN = await SQLite.query('SELECT value from Collection where key=?', ['PIN']);
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
                                }
                            }
                            if (userPIN.length > 0) {
                                this._getUserInfo({
                                    ...res.data,
                                    ...{ PIN: userPIN[0] }
                                })
                            } else {
                                this.setState({ user: res.data, popUpStateDaftarPin: true });
                                //--> _submitPIN
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
        this.setState({ user: userTmp, popUpStateDaftarPin: false })
        this._getUserInfo(userTmp);
    }
    _getDelayedList = () => {
        return new Promise((resolve, reject) => {
            log('_getDelayedList tunggu 3 detik')
            f7.preloader.show();
            setTimeout(() => {
                log('Daftar tertunda kosong ? karna tablenya belom ada, nanti kalo login upload yang ada di lokal.');
                f7.preloader.hide();
                resolve(true);
            }, 3000)
        })
    }
    _getUserInfo = (data) => {
        POST(['get_detail_cust', { agent: data.id }], ['get_activity_history', { agent: data.id }], ['get_payment_history', { agent: data.id }])
            .then(res => {
                let failedResponse = res.filter(item => { return item.status != "success" });
                if (failedResponse.length > 0) {
                    f7.dialog.alert(failedResponse[0].message);
                    return false;
                }
                failedResponse = [];
                const [detailCustomer, activityHistory, paymentHistory] = res;
                this.props.setUser(data);
                this.props.setPaymetHistory(paymentHistory);
                this.props.setActivityHistory(activityHistory);
                this.props.setDetailCustomer(detailCustomer);
                SQLite.query('SELECT value from Collection where key=?', [PIN])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [PIN, data.PIN])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                SQLite.query('SELECT value from Collection where key=?', [DEVICE_INFO])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [DEVICE_INFO, this.props.device])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                SQLite.query('SELECT value from Collection where key=?', [LIST_ACCOUNT])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [LIST_ACCOUNT, data])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                SQLite.query('SELECT value from Collection where key=?', [DETAIL_COSTUMER])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [DETAIL_COSTUMER, detailCustomer.data])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                SQLite.query('SELECT value from Collection where key=?', [ACTIVITY_HISTORY])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [ACTIVITY_HISTORY, activityHistory.data])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                SQLite.query('SELECT value from Collection where key=?', [PAYMENT_HISTORY])
                    .then(select => {
                        if (select.length == 0) {
                            SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', [PAYMENT_HISTORY, paymentHistory.data])
                                .then(insert => log(insert))
                                .catch(err => log(err));
                        }
                    }).catch(err => log(err));
                this.props.navigate('/Main/', true);
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
                        onSubmitPin={this._submitPIN}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

// _checkDate = (mobile, server) => {
//     const [dayMobile, timeMobile] = mobile.split(' ');
//     const [dayServer, timeServer] = server.split(' ');
//     const [hMobile, mMobile, sMobile] = timeMobile.split(':');
//     const [hServer, mServer, sServer] = timeServer.split(':');
//     const mobileInS = (parseInt(hMobile) * 60 * 60) + (parseInt(mMobile) * 60) + parseInt(sMobile);
//     const serverInS = (parseInt(hServer) * 60 * 60) + (parseInt(mServer) * 60) + parseInt(sServer);
//     if (dayMobile == dayServer) {
//         if (Math.abs(serverInS - mobileInS) <= 300) {
//             return true;
//         } else {
//             f7.dialog.alert('Tidak sesuai dengan jam server')
//             return false;
//         }
//     } else {
//         f7.dialog.alert('Tidak sesuai dengan jam server')
//         return false;
//     }
// }