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
import { log, Connection, SQLite } from '../../../utils/';
import { navigate, setDevice, setUser, setDeatilCust, setActivityHistory, setPaymetHistory, } from '../../../config/redux/actions/';
import { POST } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { DaftarPin } from '../../pages/'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'USER_TEST_1',
            password: '12345678',
            popUpState: false,
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
        // if (Connection() == 'OFFLINE') {
        //     f7.dialog.alert('Pastikan anda tersambung jaringan internet')
        //     return false;
        // }
        const { username, password } = this.state;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        var seconds = date.getSeconds();
        try {
            dvc ?
                this.props.setDevice(await Device.getInformation()) :
                this.props.setDevice({ available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' });

            const userPIN = await SQLite.query('SELECT value from Collection where key=?', ['PIN']);
            var data = {
                username: username,
                password: password,
                imei: JSON.stringify(this.props.device.uuid),
                iccd: JSON.stringify(this.props.device.serial),
                jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`,
            }
            POST(`Login`, data)
                .then(res => {
                    // if(this._checkDate(data.jam_mobile, res.data.jam_server) == false) return false;
                    this._getDelayedList();
                    res.data = {
                        ...res.data,
                        ...{
                            mobileTime: data.jam_mobile,
                            jam_server: res.data.jam_server,
                        }
                    }
                    if (userPIN.length > 0) {
                        res.data = {
                            ...res.data,
                            ...{ PIN: userPIN[0] }
                        }
                        this._getUserInfo(res.data)
                    } else {
                        this.setState({ user: res.data, popUpState: true });
                        //--> _submitPIN
                    }
                })
                .catch(err => log("LOGIN", err));
        } catch (err) {
            f7.dialog.alert(err);
        }
    }

    _submitPIN = (PIN) => {
        let userTmp = {
            ...Object.assign({}, this.state.user),
            ...{ PIN: PIN }
        }
        log(userTmp);
        SQLite.query('SELECT value from Collection where key=?', ['PIN'])
            .then(select => {
                if (select.length == 0) {
                    SQLite.query('INSERT into COLLECTION (id, key, value) VALUES(?,?,?)', ['PIN', PIN])
                        .then(insert => {
                            this.setState({ user: userTmp, popUpState: false })
                            this._getUserInfo(userTmp);
                        })
                        .catch(err => log(err));
                }
            })
            .catch(err => log(err))
    }

    _checkDate = (mobile, server) => {
        const [dayMobile, timeMobile] = mobile.split(' ');
        const [dayServer, timeServer] = server.split(' ');
        const [hMobile, mMobile, sMobile] = timeMobile.split(':');
        const [hServer, mServer, sServer] = timeServer.split(':');
        const mobileInS = (parseInt(hMobile) * 60 * 60) + (parseInt(mMobile) * 60) + parseInt(sMobile);
        const serverInS = (parseInt(hServer) * 60 * 60) + (parseInt(mServer) * 60) + parseInt(sServer);
        if (dayMobile == dayServer) {
            if (Math.abs(serverInS - mobileInS) <= 300) {
                return true;
            } else {
                f7.dialog.alert('Tidak sesuai dengan jam server')
                return false;
            }
        } else {
            f7.dialog.alert('Tidak sesuai dengan jam server')
            return false;
        }
    }
    _getDelayedList = () => {
        log('Daftar tertunda kosong ?')
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
                const [detailCust, activityHistory, paymentHistory] = res;
                this.props.setUser(data);
                this.props.setDeatilCust(detailCust);
                this.props.setActivityHistory(activityHistory);
                this.props.setPaymetHistory(paymentHistory);
                this.props.navigate('/Main/', true);

            })
            .catch(err => log(err))
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
                    className="demo-popup"
                    opened={this.state.popUpState}
                    onPopupClosed={() => log('pop up Closed')}
                >
                    <DaftarPin
                        onSubmitPin={this._submitPIN}
                    />
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
        setDeatilCust: (data) => dispatch(setDeatilCust(data)),
        setActivityHistory: (data) => dispatch(setActivityHistory(data)),
        setPaymetHistory: (data) => dispatch(setPaymetHistory(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);