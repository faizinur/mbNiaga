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
import { log } from '../../../utils/';
import { navigate, setDevice, setUser } from '../../../config/redux/actions/';
import { POST, Device } from '../../../utils/';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '00140515',
            password: '1234',
        };
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ', f7.views.main.router.history)
        this._onClickLogin();
    }
    _onClickLogin = async () => {
        const { username, password } = this.state;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        // try {
        //     const perangkat = await Device.getInformation();
        // this.props.setDevice(perangkat);
        var data = {
            username: username,
            password: password,
            imei: JSON.stringify(this.props.device.uuid),
            iccd: JSON.stringify(this.props.device.serial),
            jam_mobile: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        }
        // POST([`Login`,data], [`Login`,data])
        POST(`Login`, data)
            .then(res => {
                let [date, time] = res.data.last_login.split(' ');
                res.data = {
                    ...res.data , 
                    ...{
                        serverDate : date,
                        serverTime : time.substring(0,5),
                    }
                }
                // log(res.data)
                this.props.setUser(res.data);
                this.props.navigate('/Main/');
            })
            .catch(err => log("LOGIN", err));
        // } catch (err) {
        //     f7.dialog.alert(err);
        // }
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
                                >Login</Button>
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