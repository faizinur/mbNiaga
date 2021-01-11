import React, { Component } from 'react';
import {
    Block,
    Col,
    Page,
    LoginScreenTitle,
    List,
    Button,
    ListInput,
    Row
} from 'framework7-react';

import { connect } from 'react-redux';
import stylesheet from './stylesheet';
import { log } from '../../../utils/';
import { navigate, setUser } from '../../../config/redux/actions/';
import { POST } from '../../../utils/';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '00140515',
            password: '1234',
        };
    }
    componentDidMount() {
        log('componentDidMount LOGIN : ')
    }

    _onClickLogin = () => {
        const { username, password } = this.state;
        var data = {
            username: username,//'00140515',
            password: password,//'1234',
            imei: '101010101',
            iccd: '010101010',
        }
        POST(`Login`, data)
            .then(res => {
                // log("LOGIN", res)
                this.props.setUser(res.data);
                this.props.navigate('/HomeTemplates/');
            })
            .catch(err => log("LOGIN", err));
    }

    render() {
        return (
            <Page noToolbar noNavbar noSwipeback loginScreen>
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
                    <Block strong>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (data) => dispatch(setUser(data)),
        navigate: (fs) => dispatch(navigate(fs)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);