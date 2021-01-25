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
    View,
    Views,
    Toolbar,
    Link
} from 'framework7-react';

import { connect } from 'react-redux';
import stylesheet from './stylesheet';
import { log, SQLite } from '../../../utils/';
import { navigate, setDevice, setUser } from '../../../config/redux/actions/';
import { POST } from '../../../utils/';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'USER_TEST_1',
            password: '12345678',
        };
        props.setUser({});
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ');
        // this._onClickLogin();
    }
    _onClickLogin = async () => {
        let dvc = (!Device.android && !Device.ios) ? false : true;
        const { username, password } = this.state;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        try {
            dvc ?
                this.props.setDevice(await Device.getInformation()) :
                this.props.setDevice({ available: true, platform: 'Android', version: 10, uuid: '1bb9c549939b1b1e', cordova: '9.0.0', model: 'Android SDK built for x86', manufacturer: 'Google', isVirtual: true, serial: 'unknown' });

            var data = {
                username: username,
                password: password,
                imei: JSON.stringify(this.props.device.uuid),
                iccd: JSON.stringify(this.props.device.serial),
                jam_mobile: `${year}-${month < 9 ? '0' + month : month}-${day} ${hours}:${minutes}:${seconds}`,
            }
            // POST([`Login`,data], [`Login`,data])
            POST(`Login`, data)
                .then(res => {
                    // log(res.data)
                    res.data = {
                        ...res.data,
                        ...{
                            mobileTime: data.jam_mobile,
                            jam_server: res.data.jam_server,
                        }
                    }

                    SQLite.query('INSERT INTO collection(id,key,value) VALUES(?,?,?)', ['login', res.data])
                        .then(res => log(res))
                        .catch(err => log(err))

                    SQLite.query('SELECT * FROM collection')
                        .then(res => log(res))
                        .catch(err => log(err))

                    SQLite.query('SELECT * FROM collection WHERE key=?', ['login'])
                        .then(res => log(res))
                        .catch(err => log(err))

                    // SQLite.query('DELETE FROM collection')
                    //     .then(res => log(res))
                    //     .catch(err => log(err))
                    // this.props.setUser(res.data);
                    // this.props.navigate('/Main/', true);
                })
                .catch(err => log("LOGIN", err));
        } catch (err) {
            f7.dialog.alert(err);
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
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        device: state.main.device,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (data) => dispatch(setUser(data)),
        navigate: (nav) => dispatch(navigate(nav)),
        setDevice: (device) => dispatch(setDevice(device))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);