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
import { goBack, navigateTo, showAlert } from 'framework7-redux';
import { log } from '../../../utils/';
import { navigate } from '../../../config/redux/actions/routerActions';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };
    }
    componentDidMount() {
        // log('HOHOHOHO')
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
                                <Button onClick={() => this.signIn()} round style={{backgroundColor: '#c0392b', color:'white'}}>Login</Button>
                            </Col>
                        </Row>
                    </Block>
                </List>
            </Page>
        );
    }
    signIn() {
        this.props.navigate('/Check/');
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.main.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        //onUpdateUser: (data) => dispatch(updateUser(data)),
        //onLogin: () => dispatch(login()),
        navigate: (fs) => dispatch(navigate(fs))
    };
};

export default connect(null, mapDispatchToProps)(Login);